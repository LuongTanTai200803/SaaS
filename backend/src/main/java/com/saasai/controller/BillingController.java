package com.saasai.controller;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.dto.BillingInvoiceRequestDTO;
import com.saasai.dto.BillingWebhookRequestDTO;
import com.saasai.entity.BillingInvoice;
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
    public ResponseEntity<ApiResponseDTO<BillingInvoiceDTO>> createInvoice(@RequestBody BillingInvoiceRequestDTO request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        BillingInvoice invoice = billingService.createInvoice(
                userId,
                request.getPackageType(),
                request.getDurationMonths());

        BillingInvoiceDTO responseData = convertToDTO(invoice);

        return ResponseEntity.ok(ApiResponseDTO.success("Tạo hoá đơn thành công",responseData));
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

    private BillingInvoiceDTO convertToDTO(BillingInvoice invoice) {
        if (invoice == null) {
            return null;
        }

        return BillingInvoiceDTO.builder()
                .invoiceId(invoice.getInvoiceId())

                .userId(invoice.getUser() != null ? invoice.getUser().getUserId() : null)

                // 🎯 CHÍ MẠNG: Lấy packageType dạng String từ thực thể AdminPackageConfig liên
                // kết ngoại
                .packageType(invoice.getAdminPackageConfig() != null ? invoice.getAdminPackageConfig().getPackageType() : "FREE")

                .durationMonths(invoice.getDurationMonths())
                .originalAmount(invoice.getOriginalAmount())
                .discountAmount(invoice.getDiscountAmount())
                .finalAmount(invoice.getFinalAmount())
                .memoId(invoice.getMemoId())
                .qrCodeUrl(invoice.getQrCodeUrl())
                .status(invoice.getStatus() != null ? invoice.getStatus().toString() : null)
                .createdAt(invoice.getCreatedAt())
                .paymentDate(invoice.getPaymentDate())
                .build();
    }
}
