package com.saasai.service;

import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.dto.BillingWebhookRequestDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.BillingInvoice;
import com.saasai.entity.CreditTransaction;
import com.saasai.entity.User;
import com.saasai.repository.BillingInvoiceRepository;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BillingService {
    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private CreditTransactionRepository creditTransactionRepository;

    public BillingInvoiceDTO createInvoice(Long userId, String packageType, Integer durationMonths) {
        BillingInvoice.PackageType normalizedPackageType = normalizePackageType(packageType);
        Integer months = durationMonths == null || durationMonths < 1 ? 1 : durationMonths;
        String invoiceCode = String.format("%05d", ThreadLocalRandom.current().nextInt(100000));

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

    @Transactional
    public void processPaidInvoice(Long invoiceId) {
        BillingInvoice invoice = billingInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice không tồn tại"));

        if (invoice.getStatus() != BillingInvoice.InvoiceStatus.PAID) {
            return;
        }
        if (invoice.getPaymentDate() != null) {
            return; // idempotent, đã xử lý thanh toán trước đó
        }

        User user = userRepository.findById(invoice.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        AdminPackageConfig.PackageType configType = mapToAdminPackageType(invoice.getAdminPackage());
        AdminPackageConfig config = adminService.getPackageConfig(configType);

        double creditsToAdd = config.getCreditLimit();
        user.setCreditBalance((user.getCreditBalance() != null ? user.getCreditBalance() : 0.0) + creditsToAdd);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime base = user.getExpireDate() != null && user.getExpireDate().isAfter(now)
                ? user.getExpireDate()
                : now;
        user.setExpireDate(base.plusDays(invoice.getDurationMonths() * 30L));
        user.setPackageType(User.PackageType.valueOf(invoice.getAdminPackage().name()));
        userRepository.save(user);

        invoice.setPaymentDate(LocalDateTime.now());
        billingInvoiceRepository.save(invoice);

        CreditTransaction txn = CreditTransaction.builder()
                .userId(user.getId())
                .actualCreditDeducted(creditsToAdd)
                .description("Invoice " + invoice.getInvoiceId() + " PAID → credits applied")
                .type(CreditTransaction.TransactionType.PURCHASE)
                .build();
        creditTransactionRepository.save(txn);
    }

    @Transactional
    public void handleInvoiceWebhook(BillingWebhookRequestDTO request) {
        if (request.getInvoiceId() == null || request.getStatus() == null) {
            throw new IllegalArgumentException("invoiceId và status là bắt buộc");
        }

        BillingInvoice invoice = billingInvoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice không tồn tại"));

        BillingInvoice.InvoiceStatus status;
        try {
            status = BillingInvoice.InvoiceStatus.valueOf(request.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Trạng thái hóa đơn không hợp lệ");
        }

        invoice.setStatus(status);
        if (status == BillingInvoice.InvoiceStatus.PAID) {
            billingInvoiceRepository.save(invoice);
            processPaidInvoice(invoice.getInvoiceId());
        } else {
            billingInvoiceRepository.save(invoice);
        }
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

    private AdminPackageConfig.PackageType mapToAdminPackageType(BillingInvoice.PackageType packageType) {
        return switch (packageType) {
            case FREE -> AdminPackageConfig.PackageType.FREE;
            case BASIC -> AdminPackageConfig.PackageType.BASIC;
            case PROFESSIONAL -> AdminPackageConfig.PackageType.PROFESSIONAL;
            case ENTERPRISE -> AdminPackageConfig.PackageType.ENTERPRISE;
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
