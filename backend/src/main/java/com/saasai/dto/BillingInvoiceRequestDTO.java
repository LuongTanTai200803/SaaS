package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingInvoiceRequestDTO {
    private String packageType;
    private Integer durationMonths;
}
