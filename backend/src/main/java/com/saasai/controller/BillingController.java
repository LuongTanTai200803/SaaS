package com.saasai.controller;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.dto.BillingInvoiceRequestDTO;
import com.saasai.dto.BillingWebhookRequestDTO;
import com.saasai.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/billing")
@CrossOrigin
public class BillingController {
    @Autowired
    private BillingService billingService;

    @PostMapping("/invoice")
    public ResponseEntity<BillingInvoiceDTO> createInvoice(@RequestBody BillingInvoiceRequestDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        BillingInvoiceDTO invoice = billingService.createInvoice(
                userId,
                request.getPackageType(),
                request.getDurationMonths());

        return ResponseEntity.ok(invoice);
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponseDTO<Object>> billingWebhook(@RequestBody BillingWebhookRequestDTO request) {
        billingService.handleInvoiceWebhook(request);
        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Invoice webhook processed")
                .statusCode(200)
                .build());
    }
}
