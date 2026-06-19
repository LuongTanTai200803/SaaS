package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditEstimateResponseDTO {
    private Double inputCreditEstimate;
    private Double outputCreditEstimate;
    private Double totalCreditHold;
}
