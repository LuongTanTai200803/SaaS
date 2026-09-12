package com.saasai.admin;

import com.saasai.entity.BillingInvoice;
import com.saasai.entity.TransactionRecord;
import com.saasai.repository.BillingInvoiceRepository;
import com.saasai.repository.TransactionRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentAdminServiceImpl implements PaymentAdminService {

    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @Autowired
    private TransactionRecordRepository transactionRecordRepository;

    @Override
    public List<InvoiceDTO> listInvoices() {
        return billingInvoiceRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceDTO getInvoice(String invoiceId) {
        return billingInvoiceRepository.findById(invoiceId)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public List<TransactionDTO> listTransactions() {
        return transactionRecordRepository.findAll().stream()
                .map(this::toTransactionDto)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceDTO regenerateInvoiceQr(String invoiceId) {
        // Minimal safe behaviour: return current invoice DTO.
        // If you want to regenerate QR and persist, call BillingService logic here.
        return getInvoice(invoiceId);
    }

    private InvoiceDTO toDto(BillingInvoice i) {
        return new InvoiceDTO(
                i.getInvoiceId(),
                i.getUser() != null ? i.getUser().getUserId() : null,
                i.getAdminPackageConfig() != null ? i.getAdminPackageConfig().getPackageType() : null,
                i.getFinalAmount() != null ? i.getFinalAmount().longValue() : null,
                i.getStatus() != null ? i.getStatus().name() : null,
                i.getMemoId(),
                i.getQrCodeUrl(),
                i.getCreatedAt(),
                i.getPaymentDate()
        );
    }

    private TransactionDTO toTransactionDto(TransactionRecord t) {
        return new TransactionDTO(
                t.getId(),
                t.getInvoiceId(),
                t.getExternalTransactionId(),
                t.getAmount() != null ? t.getAmount().longValue() : null,
                t.getStatus(),
                t.getCreatedAt()
        );
    }
}