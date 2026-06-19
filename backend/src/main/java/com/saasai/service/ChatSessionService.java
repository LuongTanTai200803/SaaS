package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.ChatSessionCreateRequestDTO;
import com.saasai.dto.ChatSessionDTO;
import com.saasai.entity.ChatSession;
import com.saasai.repository.ChatSessionRepository;

@Service
public class ChatSessionService {
    @Autowired
    private ChatSessionRepository chatSessionRepository;

    public ChatSessionDTO createSession(Long userId, ChatSessionCreateRequestDTO request) {
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .tagId(request.getTagId())
                .sessionName(request.getSessionName())
                .editorContent("")
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

    public void updateEditorContent(Long sessionId, Long userId, String htmlContent) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setHtmlContent(htmlContent);
        session.setEditorContent(htmlContent);
        chatSessionRepository.save(session);
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
