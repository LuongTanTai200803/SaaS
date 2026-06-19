package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingWebhookRequestDTO {
    private Long invoiceId;
    private String status;
}
