package com.saasai.service;

import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.dto.BillingWebhookRequestDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.BillingInvoice;
import com.saasai.entity.CreditTransaction;
import com.saasai.entity.CreditTransaction.TransactionType;
import com.saasai.entity.User;
import com.saasai.repository.BillingInvoiceRepository;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.UserRepository;
import com.saasai.repository.AdminPackageConfigRepository;

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

    @Autowired
    private AdminPackageConfigRepository adminPackageConfigRepository; // Đã thêm để truy vấn gói động

    @Transactional
    public BillingInvoice createInvoice(
            User user,
            String rawPackageType,
            Integer months
    ) {

        String normalizedType =
                normalizePackageType(rawPackageType);

        AdminPackageConfig packageConfig =
                adminPackageConfigRepository
                        .findByPackageType(normalizedType)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Gói dịch vụ không tồn tại: "
                                                + normalizedType
                                )
                        );

        String memoId =
                "SAASAI"
                        + System.currentTimeMillis()
                        + ThreadLocalRandom.current()
                        .nextInt(1000, 9999);

        Long originalAmount =
                calculateOriginalAmount(
                        packageConfig,
                        months
                );

        Long discountAmount =
                calculateDiscount(
                        originalAmount,
                        months
                );

        Long finalAmount =
                originalAmount - discountAmount;

        String qrCodeUrl =
                generateVietQRUrl(
                        finalAmount,
                        memoId
                );

        BillingInvoice invoice =
                BillingInvoice.builder()
                        .user(user)
                        .adminPackageConfig(packageConfig)
                        .durationMonths(months)
                        .originalAmount(originalAmount)
                        .discountAmount(discountAmount)
                        .finalAmount(finalAmount)
                        .memoId(memoId)
                        .qrCodeUrl(qrCodeUrl)
                        .build();

        return billingInvoiceRepository.save(invoice);
    }
    
    @Transactional
    public void processPaymentWebhook(BillingWebhookRequestDTO webhookData) {
        if (webhookData == null || webhookData.getContent() == null) {
            return;
        }

        // Tìm hóa đơn dựa theo nội dung chuyển khoản (memoId)
        String memo = ((String) webhookData.getContent()).trim();
        BillingInvoice invoice = billingInvoiceRepository.findByMemoId(memo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với mã ghi nhớ: " + memo));

        // Nếu hóa đơn đã xử lý thành công trước đó thì bỏ qua tránh trùng lặp
        if (invoice.getStatus() == BillingInvoice.InvoiceStatus.PAID) {
            return;
        }

        // Kiểm tra số tiền chuyển khoản thực tế khớp với số tiền trên hóa đơn
        if (!invoice.getFinalAmount().equals(webhookData.getAmount())) {
            throw new RuntimeException("Số tiền thanh toán không khớp với hóa đơn");
        }

        // 1. Cập nhật trạng thái hóa đơn thành Đã thanh toán
        invoice.setStatus(BillingInvoice.InvoiceStatus.PAID);
        invoice.setPaymentDate(LocalDateTime.now());
        billingInvoiceRepository.save(invoice);

        // 2. Lấy thông tin User và cấu hình gói được mua
        User user = userRepository.findById(invoice.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        AdminPackageConfig targetPackage = invoice.getAdminPackageConfig();

        // 3. Tính toán và gia hạn thời gian sử dụng dịch vụ
        LocalDateTime currentExpire = user.getExpireDate();
        LocalDateTime newExpire = (currentExpire != null && currentExpire.isAfter(LocalDateTime.now()))
                ? currentExpire.plusMonths(invoice.getDurationMonths())
                : LocalDateTime.now().plusMonths(invoice.getDurationMonths());

        // 4. Nâng cấp thông tin User (Lưu package_id mới và cộng hạn dùng)
        user.setAdminPackageConfig(targetPackage);
        user.setExpireDate(newExpire);

        // 5. Cộng số dư Credits khuyến mãi kèm theo cấu hình gói dịch vụ đó vào tài
        // khoản khách hàng
        if (targetPackage.getCreditLimit() != null) {
            double additionalCredits = targetPackage.getCreditLimit();
            user.setCreditBalance(
                    user.getCreditBalance() == null ? additionalCredits : user.getCreditBalance() + additionalCredits);

            // Ghi nhận lịch sử giao dịch Credits hệ thống
            CreditTransaction transaction = CreditTransaction.builder()
                    .user(user)
                    .inputCredit(additionalCredits)
                    .outputCredit(0.0)
                    .totalCreditHold(0.0)
                    .actualCreditDeducted(0.0)
                    .refundedCredit(0.0)
                    .type(TransactionType.HOLD)
                    .description("Cộng credits từ việc thanh toán gói " + targetPackage.getPackageType())
                    .createdAt(LocalDateTime.now())
                    .build();
            creditTransactionRepository.save(transaction);
        }

        userRepository.save(user);
    }

    private String normalizePackageType(String packageType) {
        if (packageType == null || packageType.trim().isEmpty()) {
            return "FREE";
        }

        String trimmedUpper = packageType.trim().toUpperCase();
        return switch (trimmedUpper) {
            case "TRIAL", "FREE" -> "FREE";
            case "BASIC" -> "BASIC";
            case "PROFESSIONAL" -> "PROFESSIONAL";
            case "ENTERPRISE" -> "ENTERPRISE";
            default -> trimmedUpper;
        };
    }

    // Đã sửa đổi: Không dùng switch-case giá cứng, lấy trực tiếp giá từ thực thể DB
    private Long calculateOriginalAmount(AdminPackageConfig packageConfig, Integer months) {
        if (packageConfig == null || months == null) {
            return 0L;
        }
        return packageConfig.getPrice() * months;
    }

    private Long calculateDiscount(Long originalAmount, Integer months) {
        if (months != null && months >= 12) {
            return (long) (originalAmount * 0.2); // Giảm giá 20% khi mua gói theo năm
        }
        return 0L;
    }

    private String generateVietQRUrl(Long amount, String memo) {
        return "https://img.vietqr.io/image/vietinbank-12345678-qr_only.png?amount=" + amount + "&addInfo=" + memo;
    }

    public void handleInvoiceWebhook(BillingWebhookRequestDTO request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'handleInvoiceWebhook'");
    }

    public void processPaidInvoice(String testInvoiceId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'processPaidInvoice'");
    }
}
