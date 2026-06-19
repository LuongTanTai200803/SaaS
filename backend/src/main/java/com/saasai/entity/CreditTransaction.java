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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @Column(nullable = false)
    private Long userId;

    private Double inputCredit;

    private Double outputCredit;

    private Double totalCreditHold;

    private Double actualCreditDeducted;

    private Double refundedCredit;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TransactionType {
        HOLD, DEDUCT, REFUND, PURCHASE, BONUS
    }
}
