package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIStreamResponseDTO {
    private String type;
    private String text;
    private Double actualCreditDeducted;
    private Double refundedCredit;
    private Double currentBalance;
}
