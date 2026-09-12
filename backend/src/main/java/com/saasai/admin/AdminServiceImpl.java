package com.saasai.admin;

import com.saasai.admin.AdminDashboardDTO;
import com.saasai.admin.AdminStatsResponseDTO;
import com.saasai.admin.UserAdminDTO;
import com.saasai.admin.UserUpdateRequest;
import com.saasai.admin.AdminPackageDTO;
import com.saasai.admin.AdminPackageUpdateDTO;
import com.saasai.admin.AdminService;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.repository.BillingInvoiceRepository;
import com.saasai.repository.TransactionRecordRepository;
import com.saasai.repository.UserRepository;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.BillingInvoice;
import com.saasai.entity.TransactionRecord;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @Autowired
    private TransactionRecordRepository transactionRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CreditTransactionRepository creditTransactionRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private AdminPackageConfigRepository adminPackageConfigRepository;

    @PersistenceContext
    private EntityManager em;

    // --- get finance stats implementation requested ---------------------
    @Override
    public AdminStatsResponseDTO getFinanceStats() {
        // define time windows (VN timezone)
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDate today = LocalDate.now(zone);
        LocalDate firstOfMonth = today.withDayOfMonth(1);

        Instant dayStart = today.atStartOfDay(zone).toInstant();
        Instant now = Instant.now();

        Instant monthStart = firstOfMonth.atStartOfDay(zone).toInstant();

        // revenue today (sum finalAmount of PAID invoices with paymentDate between dayStart and now)
        TypedQuery<BigDecimal> qDay = em.createQuery(
                "SELECT COALESCE(SUM(i.finalAmount), 0) FROM BillingInvoice i WHERE i.status = :paid AND i.paymentDate BETWEEN :dayStart AND :now",
                BigDecimal.class);
        qDay.setParameter("paid", BillingInvoice.InvoiceStatus.PAID);
        qDay.setParameter("dayStart", LocalDateTime.ofInstant(dayStart, zone));
        qDay.setParameter("now", LocalDateTime.ofInstant(now, zone));
        BigDecimal revenueTodayBd = qDay.getSingleResult();

        // revenue month
        TypedQuery<BigDecimal> qMonth = em.createQuery(
                "SELECT COALESCE(SUM(i.finalAmount), 0) FROM BillingInvoice i WHERE i.status = :paid AND i.paymentDate BETWEEN :monthStart AND :now",
                BigDecimal.class);
        qMonth.setParameter("paid", BillingInvoice.InvoiceStatus.PAID);
        qMonth.setParameter("monthStart", LocalDateTime.ofInstant(monthStart, zone));
        qMonth.setParameter("now", LocalDateTime.ofInstant(now, zone));
        BigDecimal revenueMonthBd = qMonth.getSingleResult();

        // new users this month
        TypedQuery<Long> qNewUsers = em.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :monthStart AND :now",
                Long.class);
        qNewUsers.setParameter("monthStart", LocalDateTime.ofInstant(monthStart, zone));
        qNewUsers.setParameter("now", LocalDateTime.ofInstant(now, zone));
        Long newUsersCount = qNewUsers.getSingleResult();

        // total credit consumed (sum of consumed credit transactions this month) - fallback to credit transactions table
        TypedQuery<BigDecimal> qCredits = em.createQuery(
                "SELECT COALESCE(SUM(ct.amount), 0) FROM CreditTransaction ct WHERE ct.createdAt BETWEEN :monthStart AND :now",
                BigDecimal.class);
        qCredits.setParameter("monthStart", LocalDateTime.ofInstant(monthStart, zone));
        qCredits.setParameter("now", LocalDateTime.ofInstant(now, zone));
        BigDecimal totalCreditConsumedBd = qCredits.getSingleResult();

        // ai usage count approximate: number of chat sessions updated this month
        TypedQuery<Long> qAiUsage = em.createQuery(
                "SELECT COUNT(s) FROM ChatSession s WHERE s.updatedAt BETWEEN :monthStart AND :now",
                Long.class);
        qAiUsage.setParameter("monthStart", LocalDateTime.ofInstant(monthStart, zone));
        qAiUsage.setParameter("now", LocalDateTime.ofInstant(now, zone));
        Long aiUsageCount = qAiUsage.getSingleResult();

        // active affiliates placeholder (depends on your domain: if user.hasAffiliate flag or role)
        // try count users with non-null affiliate field if exists, otherwise 0
        Long activeAffiliates = 0L;
        try {
            TypedQuery<Long> qAff = em.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE u.affiliateCode IS NOT NULL",
                    Long.class);
            activeAffiliates = qAff.getSingleResult();
        } catch (Exception ex) {
            // entity may not have affiliate field; keep 0
            activeAffiliates = 0L;
        }

        AdminStatsResponseDTO dto = AdminStatsResponseDTO.builder()
                .totalRevenue(revenueMonthBd.longValue())      // use month revenue as totalRevenue field
                .newUsersCount(newUsersCount)
                .activeAffiliates(activeAffiliates)
                .totalCreditConsumed(totalCreditConsumedBd.doubleValue())
                .activeSessionsCount(aiUsageCount)
                .totalDocumentsGenerated(0L)
                .build();

        return dto;
    }

    // --- stubs for other AdminService methods (implement as needed) ---
    @Override
    public AdminDashboardDTO getDashboardOverview() { return null; }

    @Override
    public List<UserAdminDTO> listUsers(Integer page, Integer size) { return List.of(); }

    @Override
    public UserAdminDTO getUser(String userId) { return null; }

    @Override
    @Transactional
    public UserAdminDTO updateUser(String userId, UserUpdateRequest req) { return null; }

    @Override
    @Transactional
    public void deleteUser(String userId) {}

    @Override
    public List<AdminPackageDTO> listPackages() { return List.of(); }

        @Override
        public AdminPackageDTO getPackage(String packageType) {
        AdminPackageConfig cfg = adminPackageConfigRepository.findByPackageType(packageType).orElse(null);
        if (cfg == null) return null;
                return new AdminPackageDTO(
                        cfg.getId(),
                        cfg.getPackageType(),
                        cfg.getPackageCategory() != null ? cfg.getPackageCategory().name() : null,
                        cfg.getPrice(),
                        cfg.getCreditLimit(),
                        cfg.getDuration(),
                        cfg.getDescription(),
                        cfg.getStorageQuotaMb(),
                        null,
                        cfg.getCreatedAt() != null // or any boolean for isActive, adapt if you have a field
                );
        }

        @Override
        public AdminPackageConfig getPackageConfig(String packageType) {
                return adminPackageConfigRepository.findByPackageType(packageType).orElse(null);
        }

    @Override
    @Transactional
    public AdminPackageDTO upsertPackageConfig(String packageType, AdminPackageUpdateDTO req) { return null; }

    @Override
    public List<com.saasai.admin.InvoiceDTO> listInvoices(int page, int size) { return List.of(); }

    @Override
    public com.saasai.admin.InvoiceDTO getInvoice(String invoiceId) { return null; }
}