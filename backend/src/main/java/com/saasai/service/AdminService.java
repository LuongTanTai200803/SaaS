package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.entity.SystemStats;
import com.saasai.repository.SystemStatsRepository;

@Service
public class AdminService {
    @Autowired
    private SystemStatsRepository systemStatsRepository;

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
