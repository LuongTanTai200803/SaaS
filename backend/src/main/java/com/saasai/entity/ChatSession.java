package com.saasai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String tagId;

    @Column(nullable = false)
    private String sessionName;

    @Column(columnDefinition = "LONGTEXT")
    private String editorContent;

    @Column(columnDefinition = "LONGTEXT")
    private String htmlContent;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(columnDefinition = "LONGTEXT")
    private String wizardStateJson;

    private String exportFormat;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = SessionStatus.DRAFT;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SessionStatus {
        DRAFT, ACTIVE, COMPLETED, ARCHIVED
    }
}
