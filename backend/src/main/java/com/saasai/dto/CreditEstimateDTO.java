package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditEstimateDTO {
    private Double inputLength;
    private String outputOption;
    private String modelSelected;
}
