package com.saasai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String agency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private Double creditBalance;

    @Enumerated(EnumType.STRING)
    private PackageType packageType;

    private LocalDateTime expireDate;

    private String affiliateCode;

    private String affiliateLink;

    private Double totalEarnings;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        ROLE_USER, ROLE_ADMIN
    }

    public enum PackageType {
        FREE, PROFESSIONAL, ENTERPRISE
    }
}
