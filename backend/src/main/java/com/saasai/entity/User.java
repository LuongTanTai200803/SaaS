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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", columnDefinition = "CHAR(36)")
    private String userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String agency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private Double creditBalance;

    // QUAN TRỌNG: Thiết lập liên kết khóa ngoại package_id động sang
    // AdminPackageConfig
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private AdminPackageConfig adminPackageConfig;

    // public AdminPackageConfig getAdminPackageConfig() {
    //     return adminPackageConfig;
    // }
    private LocalDateTime expireDate;

    private String affiliateCode;

    private String affiliateLink;

    private Double totalEarnings;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(name = "provider")
    private String provider = "LOCAL";           // LOCAL, GOOGLE, FACEBOOK

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "verification_token")
    private String verificationToken;

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
}