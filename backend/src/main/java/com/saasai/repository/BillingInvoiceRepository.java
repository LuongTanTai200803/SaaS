package com.saasai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saasai.entity.BillingInvoice;

import java.util.Optional;

@Repository
public interface BillingInvoiceRepository extends JpaRepository<BillingInvoice, Long> {
    Optional<BillingInvoice> findByInvoiceIdAndUserId(Long invoiceId, Long userId);
}
