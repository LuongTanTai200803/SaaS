package com.saasai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.AdminPackageUpdateDTO;
import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.SystemStats;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.repository.SystemStatsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AdminService {
    @Autowired
    private SystemStatsRepository systemStatsRepository;

    @Autowired
    private AdminPackageConfigRepository adminPackageConfigRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @CacheEvict(cacheNames = "adminPackageConfig", allEntries = true)
    public AdminPackageConfig upsertPackageConfig(String packageType, AdminPackageUpdateDTO request) {
        log.info("Yêu cầu cập nhật cấu hình gói dịch vụ. Type: {}", packageType);
        
        if (request == null) {
            log.error("Cập nhật thất bại: Request body bị null");
            throw new IllegalArgumentException("Request body cannot be null");
        }
        if (packageType == null || packageType.trim().isEmpty()) {
            log.error("Cập nhật thất bại: packageType không hợp lệ (null hoặc rỗng)");
            throw new IllegalArgumentException("packageType không hợp lệ");
        }

        String normalizedType = normalizePackageType(packageType);

        AdminPackageConfig config = adminPackageConfigRepository.findByPackageType(normalizedType)
                .orElseGet(() -> {
                    log.info("Không tìm thấy cấu hình cũ. Khởi tạo cấu hình mới cho gói: {}", normalizedType);
                    return AdminPackageConfig.builder().packageType(normalizedType).build();
                });

        config.setPrice(request.getPrice());
        config.setCreditLimit(request.getCreditLimit());
        
        if (config.getStorageQuotaMb() == null) {
            long defaultQuota = defaultStorageQuota(normalizedType);
            log.debug("Storage Quota trống. Áp dụng quota mặc định cho gói {}: {} MB", normalizedType, defaultQuota);
            config.setStorageQuotaMb(defaultQuota);
        }
        
        // ... giữ nguyên phần allowedModels bên dưới (nếu có)
        
        AdminPackageConfig savedConfig = adminPackageConfigRepository.save(config);
        log.info("Cập nhật thành công cấu hình cho gói {}. Giá: {}, Hạn mức credit: {}", 
                normalizedType, savedConfig.getPrice(), savedConfig.getCreditLimit());
        return savedConfig;
    }

    @Cacheable(
            cacheNames = "adminPackageConfig",
            key = "#root.args[0].trim().toUpperCase()",
            unless = "#result == null",
            sync = true
    )
    public AdminPackageConfig getPackageConfig(String packageType) {
        String normalizedType = normalizePackageType(packageType);

        log.warn("CACHE MISS - Load AdminPackageConfig từ DB cho gói: {}", normalizedType);
        
        AdminPackageConfig config = adminPackageConfigRepository.findByPackageType(normalizedType)
                .orElseThrow(() -> {
                    log.error("Không tìm thấy cấu hình hệ thống cho gói: {}", normalizedType);
                    return new RuntimeException("Admin package config không tồn tại cho gói " + normalizedType);
                });
                
        if (config.getStorageQuotaMb() == null) {
            long defaultQuota = defaultStorageQuota(normalizedType);
            log.warn("Gói {} đã tồn tại nhưng thiếu Storage Quota. Đang bổ sung quota mặc định: {} MB", normalizedType, defaultQuota);
            config.setStorageQuotaMb(defaultQuota);
            config = adminPackageConfigRepository.save(config);
        }
        return config;
    }

    /**
     * Chuẩn hóa package type (Loại bỏ khoảng trắng và chuyển sang chữ hoa)
     */
    private String normalizePackageType(String packageType) {
        if (packageType == null) {
            log.warn("packageType truyền vào normalize bị null. Trả về rỗng.");
            return "";
        }
        return packageType.trim().toUpperCase();
    }

    public Long getDefaultStorageQuotaMb(String packageType) { 
        String normalizedType = normalizePackageType(packageType);
        Long quota = defaultStorageQuota(normalizedType);
        log.debug("Lấy dung lượng lưu trữ mặc định cho gói {}: {} MB", normalizedType, quota);
        return quota;
    }

    public AdminStatsResponseDTO getFinanceStats() {
        log.info("Yêu cầu lấy thông tin thống kê tài chính hệ thống.");
        
        SystemStats stats = systemStatsRepository.findAll().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Thống kê thất bại: Không tìm thấy bất kỳ dữ liệu SystemStats nào trong Database");
                    return new RuntimeException("No stats found");
                });

        log.debug("Đã tìm thấy bản ghi SystemStats mới nhất cập nhật lúc: {}", stats.getUpdatedAt());
        
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
        if (stats == null) {
            log.warn("Không thể cập nhật SystemStats vì đối tượng truyền vào bị null");
            return;
        }
        systemStatsRepository.save(stats);
        log.info("Cập nhật thành công thông số hệ thống SystemStats (ID: {})", stats.getId());
    }

    private Long defaultStorageQuota(String packageType) { 
        return switch (packageType) {
            case "FREE", "BASIC" -> 100L;
            case "PROFESSIONAL" -> 1024L;
            case "ENTERPRISE" -> 5120L;
            default -> {
                log.warn("Không xác định được gói '{}'. Áp dụng dung lượng mặc định: 100 MB", packageType);
                yield 100L;
            }
        };
    }
}