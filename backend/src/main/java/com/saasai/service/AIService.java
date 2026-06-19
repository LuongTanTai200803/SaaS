package com.saasai.service;

import com.saasai.ai.AiProvider;
import com.saasai.dto.AIStreamResponseDTO;
import com.saasai.entity.ChatSession;
import com.saasai.entity.User;
import com.saasai.repository.ChatSessionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AIService {
    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatSessionService chatSessionService;

    @Autowired
    private AiProvider aiProvider;

    @Autowired
    private CreditService creditService;

    public void processCompletion(Long sessionId, Long userId, String wizardStateJson, String prompt, Boolean pinEditorContext, String model, SseEmitter emitter) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        if (wizardStateJson != null && !wizardStateJson.isBlank()) {
            chatSessionService.saveWizardState(sessionId, userId, wizardStateJson);
        }

        double estimatedCredits = estimateCredits(prompt, model);
        Long transactionId = creditService.recordHoldTransaction(userId, estimatedCredits, "AI completion hold");

        AtomicInteger tokenCount = new AtomicInteger(0);
        AtomicBoolean transactionFinalized = new AtomicBoolean(false);

        emitter.onCompletion(() -> {
            if (transactionFinalized.compareAndSet(false, true)) {
                // no-op; completed successfully or already handled
            }
        });
        emitter.onTimeout(() -> {
            if (transactionFinalized.compareAndSet(false, true)) {
                creditService.refundHold(transactionId, estimatedCredits);
            }
            emitter.completeWithError(new IOException("SSE timeout"));
        });
        emitter.onError(throwable -> {
            if (transactionFinalized.compareAndSet(false, true)) {
                creditService.refundHold(transactionId, estimatedCredits);
            }
        });

        try {
            List<String> chunks = aiProvider.streamCompletion(prompt, model);
            for (String chunk : chunks) {
                tokenCount.addAndGet(countTokens(chunk));
                AIStreamResponseDTO event = AIStreamResponseDTO.builder()
                        .type("content")
                        .text(chunk)
                        .build();
                emitter.send(event);
            }

            double actualDeducted = calculateActualDebit(tokenCount.get(), model);
            double refund = Math.max(0.0, estimatedCredits - actualDeducted);
            creditService.deductCredit(transactionId, actualDeducted, refund);
            User user = userService.getUserById(userId);
            emitter.send(AIStreamResponseDTO.builder()
                    .type("verify_done")
                    .actualCreditDeducted(actualDeducted)
                    .refundedCredit(refund)
                    .currentBalance(user.getCreditBalance())
                    .build());
            if (transactionFinalized.compareAndSet(false, true)) {
                emitter.complete();
            }

            String aiResponse = String.join("\n\n", chunks);
            session.setHtmlContent(aiResponse);
            session.setEditorContent(aiResponse);
            session.setStatus(ChatSession.SessionStatus.COMPLETED);
            chatSessionRepository.save(session);
        } catch (IOException e) {
            if (transactionFinalized.compareAndSet(false, true)) {
                creditService.refundHold(transactionId, estimatedCredits);
            }
            emitter.completeWithError(e);
        } catch (Exception e) {
            double actualDeducted = calculateActualDebit(tokenCount.get(), model);
            double refund = Math.max(0.0, estimatedCredits - actualDeducted);
            creditService.deductCredit(transactionId, actualDeducted, refund);
            if (transactionFinalized.compareAndSet(false, true)) {
                emitter.completeWithError(e);
            }
        }
    }

    private double estimateCredits(String prompt, String model) {
        double modelCost = calculateModelCost(model);
        int textTokens = countTokens(prompt);
        double estimatedTokenCost = Math.max(1.0, textTokens / 50.0);
        return roundOneDecimal(modelCost + estimatedTokenCost);
    }

    private int countTokens(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    private double calculateActualDebit(int tokenCount, String model) {
        double modelCost = calculateModelCost(model);
        double tokenCost = Math.max(0.0, tokenCount / 100.0);
        return roundOneDecimal(modelCost + tokenCost);
    }

    private double calculateModelCost(String modelName) {
        if (modelName == null || modelName.isBlank()) {
            return 3.0;
        }
        String normalized = modelName.toLowerCase(java.util.Locale.ROOT);
        if (normalized.contains("opus") || normalized.contains("gpt-5") || normalized.contains("o1")) {
            return 6.0;
        }
        if (normalized.contains("sonnet") || normalized.contains("gpt-4")) {
            return 4.0;
        }
        if (normalized.contains("haiku") || normalized.contains("mini")) {
            return 2.0;
        }
        return 3.0;
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    public byte[] exportDocument(Long sessionId, Long userId, String format) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

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
