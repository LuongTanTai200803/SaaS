package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponseDTO {
    private Long totalRevenue;
    private Integer newUsersCount;
    private Integer activeAffiliates;
    private Double totalCreditConsumed;
    private Integer activeSessionsCount;
    private Integer totalDocumentsGenerated;
}
