package com.saasai.feature.payment;


import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.saasai.entity.*;
import com.saasai.feature.payment.CreditAccountRepository;
import com.saasai.feature.payment.CreditAccount;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class MonthlyQuotaPolicy implements CreditAllocationPolicy {
    private final CreditAccountRepository creditAccountRepository;

    public MonthlyQuotaPolicy(CreditAccountRepository creditAccountRepository) { this.creditAccountRepository = creditAccountRepository; }

    @Override
    @Transactional
    public void allocateSubscriptionCredits(
            User user,
            AdminPackageConfig pkg) {

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        if (pkg == null) {
            throw new IllegalArgumentException(
                    "Package không được null"
            );
        }

        // Lấy credit limit của gói subscription
        double monthly = pkg.getCreditLimit() == null
                ? 0.0
                : pkg.getCreditLimit();

        CreditAccount acc = creditAccountRepository.findById(user.getUserId())
                .orElse(
                        CreditAccount.builder()
                                .user(user)
                                .monthlyQuotaAllocated(0.0)
                                .monthlyQuotaRemaining(0.0)
                                .purchasedCreditBalance(0.0)
                                .build()
                );

        // Reset quota tháng
        acc.setMonthlyQuotaAllocated(monthly);
        acc.setMonthlyQuotaRemaining(monthly);

        // Chu kỳ của quota hiện tại: 1 tháng
        acc.setMonthlyQuotaCycleStart(now);
        acc.setMonthlyQuotaCycleEnd(
                now.plusMonths(1)
        );

        creditAccountRepository.save(acc);
    }

    @Override
    @Transactional
    public void allocateCreditPack(
            User user,
            double credits,
            int durationDays) {

        if (credits <= 0) {
            throw new IllegalArgumentException(
                    "Số credit phải lớn hơn 0"
            );
        }

        if (durationDays <= 0) {
            throw new IllegalArgumentException(
                    "Thời hạn credit pack phải lớn hơn 0 ngày"
            );
        }

        CreditAccount acc = creditAccountRepository.findById(user.getUserId())
                .orElse(
                        CreditAccount.builder()
                                .user(user)
                                .build()
                );

        // Lấy số credit hiện tại, nếu null thì mặc định 0.0
        double currentBalance =
                acc.getPurchasedCreditBalance() == null
                        ? 0.0
                        : acc.getPurchasedCreditBalance();

        // Cộng credit
        acc.setPurchasedCreditBalance(
                currentBalance + credits
        );

        // Thời điểm mua mới
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        acc.setPurchasedCreditPurchasedAt(now);

        // Reset expiry
        acc.setPurchasedCreditExpireAt(
                now.plusDays(durationDays)
        );

        creditAccountRepository.save(acc);
    }

    @Override
    @Transactional
    public void resetMonthlyQuotaIfNeeded(User user) {
        if (user == null) return;

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        CreditAccount acc =
                    creditAccountRepository.findById(user.getUserId())
                            .orElse(null);

        if (acc == null) {
            return;
        }
        // Chưa hết chu kỳ quota
        if (acc.getMonthlyQuotaCycleEnd() != null
                && now.isBefore(acc.getMonthlyQuotaCycleEnd())) {
            return;
        }

        AdminPackageConfig pkg = user.getAdminPackageConfig();

        // Subscription hết hạn → không cấp quota mới
        if (user.getExpireDate() == null
                || !now.isBefore(user.getExpireDate())) {
            acc.setMonthlyQuotaRemaining(pkg.getCreditLimit() != null ? pkg.getCreditLimit() : 0.0);
            creditAccountRepository.save(acc);
            return;
        }

        // Cấp lại quota mới dựa trên credit limit của gói subscription
        double monthly = pkg.getCreditLimit();

        // Reset quota tháng
        acc.setMonthlyQuotaAllocated(monthly);
        acc.setMonthlyQuotaRemaining(monthly);

        acc.setMonthlyQuotaCycleStart(acc.getMonthlyQuotaCycleEnd() != null
                ? acc.getMonthlyQuotaCycleEnd()
                : acc.getMonthlyQuotaCycleEnd());
                
        acc.setMonthlyQuotaCycleEnd(acc.getMonthlyQuotaCycleEnd().plusMonths(1));

        creditAccountRepository.save(acc);
    }
}
