package com.saasai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "transaction_id", columnDefinition = "CHAR(36)")
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "input_credit")
    private Double inputCredit;

    @Column(name = "output_credit")
    private Double outputCredit;

    @Column(name = "total_credit_hold")
    private Double totalCreditHold;

    @Column(name = "actual_credit_deducted")
    private Double actualCreditDeducted;

    @Column(name = "refunded_credit")
    private Double refundedCredit;

    // enum for transaction type
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TransactionType type;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum TransactionType {
        HOLD,
        DEDUCT,
        REFUND
    }
}