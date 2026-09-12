package com.saasai.repository;

import com.saasai.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {
    Optional<TransactionRecord> findByExternalTransactionId(String externalTransactionId);
    Optional<TransactionRecord> findByInvoiceId(String invoiceId);
    Optional<TransactionRecord> findByMemoId(String memoId);
}