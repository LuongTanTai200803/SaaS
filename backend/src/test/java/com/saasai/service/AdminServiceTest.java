package com.saasai.service;

import com.saasai.entity.AdminPackageConfig;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.repository.SystemStatsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminPackageConfigRepository adminPackageConfigRepository;

    @Mock
    private SystemStatsRepository systemStatsRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void getPackageConfig_shouldBackfillMissingQuota() {
        AdminPackageConfig config = AdminPackageConfig.builder()
                .packageType("FREE")
                .price(0L)
                .creditLimit(0.0)
                .storageQuotaMb(null)
                .build();

        when(adminPackageConfigRepository.findByPackageType("FREE"))
                .thenReturn(Optional.of(config));
        when(adminPackageConfigRepository.save(config)).thenReturn(config);

        AdminPackageConfig result = adminService.getPackageConfig("FREE");

        assertThat(result.getStorageQuotaMb()).isEqualTo(100L);
        verify(adminPackageConfigRepository).save(config);
    }
}
