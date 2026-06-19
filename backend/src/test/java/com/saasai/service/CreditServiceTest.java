package com.saasai.service;

import com.saasai.dto.CreditEstimateDTO;
import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.entity.FileUpload;
import com.saasai.entity.User;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.FileUploadRepository;
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
    private FileUploadRepository fileUploadRepository;

    @InjectMocks
    private CreditService creditService;

    @BeforeEach
    void setUp() {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(10293L, null);
        authentication.setDetails("user@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void estimateCreditsShouldCalculateFromModelAndFeaturesWithoutFile() {
        User user = User.builder().id(10293L).email("user@example.com").creditBalance(10.0).build();
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
        User user = User.builder().id(10293L).email("user@example.com").creditBalance(20.0).build();
        FileUpload fileUpload = FileUpload.builder().fileId(15L).userId(10293L).fileSize(2L * 1024 * 1024).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW", "EXPORT_DOCX"))
                .fileId("file_15")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(fileUploadRepository.findById(15L)).thenReturn(Optional.of(fileUpload));

        CreditEstimateResponseDTO response = creditService.estimateCredits(request);

        assertEquals(7.5, response.getEstimatedCredits());
        assertTrue(response.getIsEligible());
    }

    @Test
    void estimateCreditsShouldThrowWhenFileBelongsToAnotherUser() {
        User user = User.builder().id(10293L).email("user@example.com").creditBalance(20.0).build();
        FileUpload fileUpload = FileUpload.builder().fileId(15L).userId(99999L).fileSize(1024L).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW"))
                .fileId("15")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(fileUploadRepository.findById(15L)).thenReturn(Optional.of(fileUpload));

        assertThrows(AccessDeniedException.class, () -> creditService.estimateCredits(request));
    }

    @Test
    void estimateCreditsShouldThrowOnInvalidFileIdFormat() {
        User user = User.builder().id(10293L).email("user@example.com").creditBalance(20.0).build();
        CreditEstimateDTO request = CreditEstimateDTO.builder()
                .modelName("claude-sonnet-4.6")
                .features(List.of("LEGAL_REVIEW"))
                .fileId("file_abc")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> creditService.estimateCredits(request));
    }

    @Test
    void estimateCreditsShouldMarkIneligibleWhenCreditsAreInsufficient() {
        User user = User.builder().id(10293L).email("user@example.com").creditBalance(2.0).build();
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