package com.saasai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.BillingInvoice;

import java.util.Optional;

@Repository
public interface BillingInvoiceRepository extends JpaRepository<BillingInvoice, String> {
    Optional<BillingInvoice> findByInvoiceIdAndUser_UserId(String invoiceId, String userId);

    Optional<BillingInvoice> findByMemoId(String memo);


    Optional<BillingInvoice> findById(String testInvoiceId);
}
