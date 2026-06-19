package com.saasai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.AdminPackageUpdateDTO;
import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.SystemStats;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.repository.SystemStatsRepository;

@Service
public class AdminService {
    @Autowired
    private SystemStatsRepository systemStatsRepository;

    @Autowired
    private AdminPackageConfigRepository adminPackageConfigRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdminPackageConfig upsertPackageConfig(String packageType, AdminPackageUpdateDTO request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body cannot be null");
        }
        if (packageType == null || packageType.trim().isEmpty()) {
            throw new IllegalArgumentException("packageType không hợp lệ");
        }

        AdminPackageConfig.PackageType normalizedType;
        try {
            normalizedType = AdminPackageConfig.PackageType.valueOf(packageType.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("packageType không hợp lệ");
        }

        AdminPackageConfig config = adminPackageConfigRepository.findByPackageType(normalizedType)
                .orElseGet(() -> AdminPackageConfig.builder().packageType(normalizedType).build());

        config.setPrice(request.getPrice());
        config.setCreditLimit(request.getCreditLimit());
        try {
            config.setAllowedModels(objectMapper.writeValueAsString(request.getAllowedModels() != null ? request.getAllowedModels() : java.util.List.of()));
        } catch (Exception ex) {
            throw new RuntimeException("Không thể lưu allowedModels", ex);
        }

        return adminPackageConfigRepository.save(config);
    }

    public AdminStatsResponseDTO getFinanceStats() {
        // Get the latest stats from database
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
}
