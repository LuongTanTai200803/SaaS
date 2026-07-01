package com.saasai.service;

import com.saasai.dto.CreditEstimateDTO;
import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.entity.FileMetadata; 
import com.saasai.entity.User;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.FileMetadataRepository;
import com.saasai.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreditServiceTest {

    @Mock
    private CreditTransactionRepository creditTransactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileMetadataRepository fileUploadRepository;

    @InjectMocks
    private CreditService creditService;

    private final String testUserId = "user-uuid-10293"; // 🎯 ĐÃ SỬA

    @BeforeEach
    void setUp() {
        // Principal bây giờ lưu chuỗi String đại diện cho UUID người dùng
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(testUserId, null);
        authentication.setDetails("user@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void estimateCreditsShouldCalculateFromModelAndFeaturesWithoutFile() {
        User user = User.builder().userId(testUserId).email("user@example.com").creditBalance(10.0).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW", "EXPORT_DOCX"))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        CreditEstimateResponseDTO response = creditService.estimateCredits(request);

        assertEquals(5.5, response.getEstimatedCredits());
        assertEquals(10.0, response.getCurrentCredits());
        assertTrue(response.getIsEligible());
    }

    @Test
    void estimateCreditsShouldAddFileCostForOwnedFile() {
        User user = User.builder().userId(testUserId).email("user@example.com").creditBalance(20.0).build();
        // Sửa fileId sang String khớp cấu hình flyway schema
        FileMetadata fileUpload = FileMetadata.builder().fileId("file-uuid-15").user(user).fileSize(2L * 1024 * 1024).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW", "EXPORT_DOCX"))
                .fileId("file-uuid-15")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(fileUploadRepository.findById("file-uuid-15")).thenReturn(Optional.of(fileUpload));

        CreditEstimateResponseDTO response = creditService.estimateCredits(request);

        assertEquals(7.5, response.getEstimatedCredits());
        assertTrue(response.getIsEligible());
    }

    @Test
    void estimateCreditsShouldThrowWhenFileBelongsToAnotherUser() {
        User user = User.builder().userId(testUserId).email("user@example.com").creditBalance(20.0).build();
        User otherUser = User.builder().userId("other-user-uuid").email("other@example.com").creditBalance(20.0).build();
        FileMetadata fileUpload = FileMetadata.builder().fileId("file-uuid-15").user(otherUser).fileSize(1024L).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW"))
                .fileId("file-uuid-15")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(fileUploadRepository.findById("file-uuid-15")).thenReturn(Optional.of(fileUpload));

        assertThrows(AccessDeniedException.class, () -> creditService.estimateCredits(request));
    }

    @Test
    void estimateCreditsShouldMarkIneligibleWhenCreditsAreInsufficient() {
        User user = User.builder().userId(testUserId).email("user@example.com").creditBalance(2.0).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW", "EXPORT_DOCX"))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        CreditEstimateResponseDTO response = creditService.estimateCredits(request);

        assertEquals(5.5, response.getEstimatedCredits());
        assertFalse(response.getIsEligible());
    }
}