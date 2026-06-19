package com.saasai.service;

import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.User;
import com.saasai.repository.FileUploadRepository;
import com.saasai.repository.UserRepository;
import com.saasai.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class FileServiceQuotaTest {
    @Mock
    private FileUploadRepository fileUploadRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminService adminService;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private FileService fileService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(1L, null);
        authentication.setDetails("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        user = User.builder().id(1L).email("test@example.com").fullName("Test User").creditBalance(10.0).packageType(User.PackageType.FREE).build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(adminService.getPackageConfig(AdminPackageConfig.PackageType.FREE))
                .thenReturn(AdminPackageConfig.builder()
                        .packageType(AdminPackageConfig.PackageType.FREE)
                        .price(0L)
                        .creditLimit(0.0)
                        .storageQuotaMb(1L)
                        .build());
        when(fileUploadRepository.sumFileSizeByUserId(1L)).thenReturn(900L * 1024L);
    }

    @Test
    void uploadFile_shouldRejectWhenStorageQuotaExceeded() throws IOException {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(adminService.getPackageConfig(AdminPackageConfig.PackageType.FREE))
                .thenReturn(AdminPackageConfig.builder().packageType(AdminPackageConfig.PackageType.FREE).storageQuotaMb(1L).price(0L).creditLimit(0.0).build());
        when(fileUploadRepository.sumFileSizeByUserId(1L)).thenReturn(900L * 1024L);

        MockMultipartFile file = new MockMultipartFile("file", "document.pdf", "application/pdf", new byte[300 * 1024]);

        assertThatThrownBy(() -> fileService.uploadFile(file, "INPUT_DIRECTIVE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Vượt quá hạn mức lưu trữ");
    }
}
