package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.saasai.dto.ChatSessionCreateRequestDTO;
import com.saasai.dto.ChatSessionDTO;
import com.saasai.entity.ChatSession;
import com.saasai.entity.User;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class ChatSessionService {
    private static final String DEFAULT_SESSION_NAME = "Cuộc trò chuyện mới";

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatSessionDTO createSession(String email, ChatSessionCreateRequestDTO request) {
        String currentEmail = resolveCurrentEmail(email);

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        String normalizedSessionName = request.getSessionName() == null || request.getSessionName().trim().isEmpty()
                ? DEFAULT_SESSION_NAME
                : request.getSessionName().trim();

        ChatSession session = ChatSession.builder()
                .userId(user.getId())
                .tagId(request.getTagId())
                .sessionName(normalizedSessionName)
                .editorContent("")
                .htmlContent("")
                .build();

        ChatSession saved = chatSessionRepository.save(session);

        return ChatSessionDTO.builder()
                .sessionId(saved.getSessionId())
                .tagId(saved.getTagId())
                .sessionName(saved.getSessionName())
                .currentEditorContent(saved.getEditorContent())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public void updateEditorContent(Long sessionId, String email, String htmlContent) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        String currentEmail = resolveCurrentEmail(email);
        User owner = userRepository.findById(session.getUserId())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        if (currentEmail == null || owner.getEmail() == null || !owner.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new AccessDeniedException("Phát hiện giả mạo danh tính: bạn không có quyền cập nhật phiên này");
        }

        session.setEditorContent(htmlContent == null ? "" : htmlContent);
        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);
    }

    private String resolveCurrentEmail(String fallbackEmail) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof String details && !details.isBlank()) {
            return details;
        }
        return fallbackEmail;
    }

    public ChatSession getSession(Long sessionId, Long userId) {
        return chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void saveWizardState(Long sessionId, Long userId, String wizardStateJson) {
        ChatSession session = getSession(sessionId, userId);
        session.setWizardStateJson(wizardStateJson);
        chatSessionRepository.save(session);
    }
}
