package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.entity.BillingInvoice;
import com.saasai.repository.BillingInvoiceRepository;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BillingService {
    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    public BillingInvoiceDTO createInvoice(Long userId, String packageType, Integer durationMonths) {
    BillingInvoice.PackageType normalizedPackageType = normalizePackageType(packageType);
    Integer months = durationMonths == null || durationMonths < 1 ? 1 : durationMonths;
        String invoiceCode = String.format("%05d", ThreadLocalRandom.current().nextInt(100000));

        // Calculate price based on package type
    Long originalAmount = calculateOriginalAmount(normalizedPackageType, months);
    Long discountAmount = calculateDiscount(originalAmount, months);
        Long finalAmount = originalAmount - discountAmount;

        String memoId = "NAPTIEN_" + userId + "_INV" + invoiceCode;

        BillingInvoice invoice = BillingInvoice.builder()
                .userId(userId)
        .packageType(normalizedPackageType)
        .durationMonths(months)
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .memoId(memoId)
                .qrCodeUrl(generateVietQRUrl(finalAmount, memoId))
                .status(BillingInvoice.InvoiceStatus.PENDING)
                .build();

        BillingInvoice saved = billingInvoiceRepository.save(invoice);

        return BillingInvoiceDTO.builder()
            .invoiceId("INV_" + invoiceCode)
                .memoId(memoId)
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .qrCodeUrl(saved.getQrCodeUrl())
                .status(saved.getStatus().toString())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private BillingInvoice.PackageType normalizePackageType(String packageType) {
        if (packageType == null || packageType.trim().isEmpty()) {
            return BillingInvoice.PackageType.FREE;
        }

        return switch (packageType.trim().toUpperCase()) {
            case "TRIAL", "FREE" -> BillingInvoice.PackageType.FREE;
            case "BASIC" -> BillingInvoice.PackageType.BASIC;
            case "PROFESSIONAL" -> BillingInvoice.PackageType.PROFESSIONAL;
            case "ENTERPRISE" -> BillingInvoice.PackageType.ENTERPRISE;
            default -> BillingInvoice.PackageType.valueOf(packageType.trim().toUpperCase());
        };
    }

    private Long calculateOriginalAmount(BillingInvoice.PackageType packageType, Integer months) {
        Long pricePerMonth = switch (packageType) {
            case FREE -> 0L;
            case BASIC -> 199000L;
            case PROFESSIONAL -> 549000L;
            case ENTERPRISE -> 1199000L;
        };
        return pricePerMonth * months;
    }

    private Long calculateDiscount(Long originalAmount, Integer months) {
        // 20% discount for annual subscription
        if (months >= 12) {
            return (long) (originalAmount * 0.2);
        }
        return 0L;
    }

    private String generateVietQRUrl(Long amount, String memo) {
        return "https://img.vietqr.io/image/vietinbank-12345678-qr_only.jpg?amount=" +
                amount + "&addInfo=" + memo;
    }
}
