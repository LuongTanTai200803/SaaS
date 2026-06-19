package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.AIStreamResponseDTO;
import com.saasai.entity.ChatSession;
import com.saasai.repository.ChatSessionRepository;

import java.util.List;

@Service
public class AIService {
    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatSessionService chatSessionService;

    public List<AIStreamResponseDTO> processCompletion(Long sessionId, Long userId, String wizardStateJson, String prompt, Boolean pinEditorContext, String model) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (wizardStateJson != null && !wizardStateJson.isBlank()) {
            chatSessionService.saveWizardState(sessionId, userId, wizardStateJson);
        }

        // Simulate AI processing - in production, integrate with Claude API
        String firstChunk = "### 1. VĂN BẢN HOÀN CHỈNH\n" +
                "Nội dung được xử lý bởi AI...";
        String secondChunk = "### 4. GHI CHÚ KIỂM TRA TRƯỚC KHI TRÌNH KÝ\n" +
                "Đã hoàn tất kiểm tra...";
        String aiResponse = firstChunk + "\n\n" + secondChunk;

        Double creditDeducted = 4.1;
        Double refunded = 0.4;
        Double currentBalance = userService.updateUserCredit(userId, creditDeducted - refunded);

        // Save updated content to session
        session.setHtmlContent(aiResponse);
        session.setEditorContent(aiResponse);
        session.setStatus(ChatSession.SessionStatus.COMPLETED);
        chatSessionRepository.save(session);

        return List.of(
                AIStreamResponseDTO.builder()
                        .type("content")
                        .text(firstChunk)
                        .build(),
                AIStreamResponseDTO.builder()
                        .type("content")
                        .text(secondChunk)
                        .build(),
                AIStreamResponseDTO.builder()
                        .type("verify_done")
                        .actualCreditDeducted(creditDeducted)
                        .refundedCredit(refunded)
                        .currentBalance(currentBalance)
                        .build());
    }

    public byte[] exportDocument(Long sessionId, Long userId, String format) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        String content = session.getHtmlContent();
        if (content == null || content.isBlank()) {
            content = session.getEditorContent();
        }
        if (content == null) {
            content = "";
        }

        String normalizedFormat = format == null ? "TXT" : format.trim().toUpperCase();
        byte[] bytes;
        switch (normalizedFormat) {
            case "TXT":
                bytes = content.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                break;
            case "DOCX":
            case "PDF":
                String fallback = "Document export fallback for " + normalizedFormat + "\n\n" + content;
                bytes = fallback.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                break;
            default:
                String defaultExport = "Unsupported format " + normalizedFormat + ". Export content:\n\n" + content;
                bytes = defaultExport.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                break;
        }
        return bytes;
    }
}
