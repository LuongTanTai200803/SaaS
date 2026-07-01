package com.saasai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.AdminPackageUpdateDTO;
import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.SystemStats;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.repository.SystemStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private SystemStatsRepository systemStatsRepository;

    @Autowired
    private AdminPackageConfigRepository adminPackageConfigRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @CacheEvict(cacheNames = "adminPackageConfig", allEntries = true)
    public AdminPackageConfig upsertPackageConfig(String packageType, AdminPackageUpdateDTO request) {
        if (request == null)
            throw new IllegalArgumentException("Request body cannot be null");
        if (packageType == null || packageType.trim().isEmpty()) {
            throw new IllegalArgumentException("packageType không hợp lệ");
        }

        String normalizedType = packageType.trim().toUpperCase(); // Chuẩn hóa chữ hoa luôn

        AdminPackageConfig config = adminPackageConfigRepository.findByPackageType(normalizedType)
                .orElseGet(() -> AdminPackageConfig.builder().packageType(normalizedType).build());

        config.setPrice(request.getPrice());
        config.setCreditLimit(request.getCreditLimit());
        if (config.getStorageQuotaMb() == null) {
            config.setStorageQuotaMb(defaultStorageQuota(normalizedType));
        }
        // ... giữ nguyên phần allowedModels bên dưới
        return adminPackageConfigRepository.save(config);
    }

    @Cacheable(cacheNames = "adminPackageConfig", key = "#packageType")
    public AdminPackageConfig getPackageConfig(String packageType) { // Đổi sang String
        String normalizedType = packageType.trim().toUpperCase();
        AdminPackageConfig config = adminPackageConfigRepository.findByPackageType(normalizedType)
                .orElseThrow(
                        () -> new RuntimeException("Admin package config không tồn tại cho gói " + normalizedType));
        if (config.getStorageQuotaMb() == null) {
            config.setStorageQuotaMb(defaultStorageQuota(normalizedType));
            config = adminPackageConfigRepository.save(config);
        }
        return config;
    }

    public Long getDefaultStorageQuotaMb(String packageType) { // Đổi sang String
        return defaultStorageQuota(packageType.trim().toUpperCase());
    }

    public AdminStatsResponseDTO getFinanceStats() {
        SystemStats stats = systemStatsRepository.findAll().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No stats found"));

        return AdminStatsResponseDTO.builder()
                .totalRevenue(stats.getTotalRevenue())
                .newUsersCount(stats.getNewUsersCount())
                .activeAffiliates(stats.getActiveAffiliates())
                .totalCreditConsumed(stats.getTotalCreditConsumed())
                .activeSessionsCount(stats.getActiveSessionsCount())
                .totalDocumentsGenerated(stats.getTotalDocumentsGenerated())
                .build();
    }

    public void updateStats(SystemStats stats) {
        systemStatsRepository.save(stats);
    }

    private Long defaultStorageQuota(String packageType) { // Đổi sang String
        return switch (packageType) {
            case "FREE", "BASIC" -> 100L;
            case "PROFESSIONAL" -> 1024L;
            case "ENTERPRISE" -> 5120L;
            default -> 100L;
        };
    }
}
