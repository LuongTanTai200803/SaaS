package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponseDTO {
    private Long totalRevenue;
    private Long newUsersCount;
    private Long activeAffiliates;
    private Double totalCreditConsumed;
    private Long activeSessionsCount;
    private Long totalDocumentsGenerated;
}
