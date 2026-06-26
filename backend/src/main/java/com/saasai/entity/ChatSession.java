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
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "tag_id")
    private String tagId;

    @Column(name = "session_name", nullable = false)
    private String sessionName;

    @Column(name = "editor_content", columnDefinition = "LONGTEXT")
    private String editorContent;

    @Column(name = "html_content", columnDefinition = "LONGTEXT")
    private String htmlContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SessionStatus status;

    @Column(name = "wizard_state_json", columnDefinition = "JSON")
    private String wizardStateJson;

    @Column(name = "chat_history_json", columnDefinition = "JSON")
    private String chatHistoryJson;

    @Column(name = "export_format")
    private String exportFormat;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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
