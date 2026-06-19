package com.saasai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPackageConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private PackageType packageType;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private Double creditLimit;

    @Column(columnDefinition = "JSON")
    private String allowedModels;

    private String description;

    private Long storageQuotaMb;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (storageQuotaMb == null) {
            storageQuotaMb = defaultStorageQuotaMb();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (storageQuotaMb == null) {
            storageQuotaMb = defaultStorageQuotaMb();
        }
    }

    public enum PackageType {
        FREE, BASIC, PROFESSIONAL, ENTERPRISE
    }

    private Long defaultStorageQuotaMb() {
        return switch (packageType) {
            case FREE -> 100L;
            case BASIC -> 100L;
            case PROFESSIONAL -> 1024L;
            case ENTERPRISE -> 5120L;
        };
    }
}
