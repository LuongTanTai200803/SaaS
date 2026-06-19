package com.saasai.service;

import com.saasai.ai.AiProvider;
import com.saasai.dto.AIStreamResponseDTO;
import com.saasai.entity.ChatSession;
import com.saasai.entity.User;
import com.saasai.repository.ChatSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AIServiceTest {
    @Mock
    private ChatSessionRepository chatSessionRepository;

    @Mock
    private UserService userService;

    @Mock
    private ChatSessionService chatSessionService;

    @Mock
    private AiProvider aiProvider;

    @Mock
    private CreditService creditService;

    @InjectMocks
    private AIService aiService;

    private ChatSession session;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new ChatSession();
        session.setSessionId(10L);
        session.setUserId(1L);
        user = User.builder().id(1L).creditBalance(20.0).build();
    }

    @Test
    void processCompletion_shouldDeductActualCreditsAndSendVerifyDone() throws IOException {
        when(chatSessionRepository.findBySessionIdAndUserId(10L, 1L)).thenReturn(Optional.of(session));
        when(aiProvider.streamCompletion(any(), any())).thenReturn(List.of("token one", "token two"));
        when(userService.getUserById(1L)).thenReturn(user);
        when(creditService.recordHoldTransaction(eq(1L), anyDouble(), eq("AI completion hold"))).thenReturn(123L);

        SseEmitter emitter = new SseEmitter(0L);
        aiService.processCompletion(10L, 1L, null, "prompt text", false, "gpt-4", emitter);

        verify(creditService).recordHoldTransaction(eq(1L), anyDouble(), eq("AI completion hold"));
        verify(creditService).deductCredit(eq(123L), anyDouble(), anyDouble());
        verify(chatSessionRepository).save(any(ChatSession.class));
    }

    @Test
    void processCompletion_onProviderError_shouldRefundHold() throws IOException {
        when(chatSessionRepository.findBySessionIdAndUserId(10L, 1L)).thenReturn(Optional.of(session));
        when(aiProvider.streamCompletion(any(), any())).thenThrow(new IOException("Provider failed"));
        when(creditService.recordHoldTransaction(eq(1L), anyDouble(), eq("AI completion hold"))).thenReturn(124L);

        SseEmitter emitter = new SseEmitter(0L);
        aiService.processCompletion(10L, 1L, null, "prompt text", false, "gpt-4", emitter);

        verify(creditService).recordHoldTransaction(eq(1L), anyDouble(), eq("AI completion hold"));
        verify(creditService).refundHold(eq(124L), anyDouble());
        verify(creditService, never()).deductCredit(eq(124L), anyDouble(), anyDouble());
    }
}
