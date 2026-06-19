package com.saasai.service;

import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.BillingInvoice;
import com.saasai.entity.CreditTransaction;
import com.saasai.entity.User;
import com.saasai.repository.BillingInvoiceRepository;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BillingServiceTest {
    @Mock
    private BillingInvoiceRepository billingInvoiceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminService adminService;

    @Mock
    private CreditTransactionRepository creditTransactionRepository;

    @InjectMocks
    private BillingService billingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void processPaidInvoice_shouldApplyCreditsAndExpiryOnce() {
        User user = User.builder()
                .id(1L)
                .creditBalance(10.0)
                .expireDate(LocalDateTime.now().minusDays(1))
                .packageType(User.PackageType.FREE)
                .build();
        BillingInvoice invoice = BillingInvoice.builder()
                .invoiceId(100L)
                .userId(1L)
                .packageType(BillingInvoice.PackageType.BASIC)
                .durationMonths(2)
                .status(BillingInvoice.InvoiceStatus.PAID)
                .build();
        AdminPackageConfig config = AdminPackageConfig.builder()
                .packageType(AdminPackageConfig.PackageType.BASIC)
                .creditLimit(100.0)
                .storageQuotaMb(100L)
                .price(199000L)
                .build();

        when(billingInvoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(adminService.getPackageConfig(AdminPackageConfig.PackageType.BASIC)).thenReturn(config);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(billingInvoiceRepository.save(any(BillingInvoice.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(creditTransactionRepository.save(any(CreditTransaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        billingService.processPaidInvoice(100L);

        assertThat(user.getCreditBalance()).isEqualTo(110.0);
        assertThat(user.getExpireDate()).isAfter(LocalDateTime.now().plusDays(59));
        assertThat(user.getPackageType()).isEqualTo(User.PackageType.BASIC);

        verify(creditTransactionRepository, times(1)).save(any(CreditTransaction.class));

        // Idempotency: second call should not create another transaction
        billingService.processPaidInvoice(100L);
        verify(creditTransactionRepository, times(1)).save(any(CreditTransaction.class));
    }
}
