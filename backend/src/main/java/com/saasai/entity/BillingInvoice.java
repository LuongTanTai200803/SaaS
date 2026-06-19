package com.saasai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "billing_invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    private Integer durationMonths;

    private Long originalAmount;

    private Long discountAmount;

    private Long finalAmount;

    private String memoId;

    private String qrCodeUrl;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime paymentDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = InvoiceStatus.PENDING;
    }

    public enum PackageType {
        FREE, BASIC, PROFESSIONAL, ENTERPRISE
    }

    public enum InvoiceStatus {
        PENDING, PAID, CANCELLED, EXPIRED
    }
}
