package com.saasai.service;

import com.saasai.ai.AiProvider;
import com.saasai.dto.AIStreamResponseDTO;
import com.saasai.entity.ChatSession;
import com.saasai.entity.CreditTransaction;
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
import static org.mockito.ArgumentMatchers.anyDouble;
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
    private final String testUserId = "user-uuid-1"; // 🎯 ĐÃ SỬA: Chuyển sang String UUID

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new ChatSession();
        session.setSessionId(10);
        // 🎯 ĐÃ SỬA: Chuyển sang String UUID 
        session.setUser(User.builder().userId(testUserId).build()); // 🎯 ĐÃ SỬA
        user = User.builder().userId(testUserId).creditBalance(20.0).build(); // 🎯 ĐÃ SỬA: Dùng userId(String)
    }

    @Test
    void processCompletion_shouldDeductActualCreditsAndSendVerifyDone() throws IOException {
        // 1. 🎯 ĐÃ SỬA: Tạo đối tượng Entity mồi để trả về đúng kiểu dữ liệu
        CreditTransaction mockTransaction = CreditTransaction.builder()
                .user(user) // Giả sử thực thể CreditTransaction của ông có trường id kiểu Long
                .totalCreditHold(5.0)
                .build();

        when(chatSessionRepository.findBySessionIdAndUser_UserId(10, testUserId)).thenReturn(Optional.of(session));
        when(aiProvider.streamCompletion(any(), any())).thenReturn(List.of("token one", "token two"));
        when(userService.getUserById(testUserId)).thenReturn(user);
        
        // 2. 🎯 ĐÃ SỬA: `.thenReturn(mockTransaction)` thay vì `.thenReturn(123L)`
        when(creditService.recordHoldTransaction(eq(testUserId), anyDouble(), eq("AI completion hold")))
                .thenReturn(mockTransaction); 

        SseEmitter emitter = new SseEmitter(0L);
        aiService.processCompletion(10, testUserId, null, "prompt text", false, "gpt-4", emitter);

        verify(creditService).recordHoldTransaction(eq(testUserId), anyDouble(), eq("AI completion hold"));
        
        // 3. 🎯 LƯU Ý PHỤ CHÍ MẠNG: Nếu hàm `deductCredit` của ông bốc ID từ transaction ra để xử lý, 
        // thì verify truyền vào đúng số 123L là chuẩn bài rồi.
        verify(creditService).deductCredit(eq("123"), anyDouble(), anyDouble());
        verify(chatSessionRepository).save(any(ChatSession.class));
    }

    @Test
    void processCompletion_onProviderError_shouldRefundHold() throws IOException {
        CreditTransaction mockTransaction = CreditTransaction.builder()
                .user(user) // Giả sử thực thể CreditTransaction của ông có trường id kiểu Long
                .totalCreditHold(5.0)
                .build();
                
        when(chatSessionRepository.findBySessionIdAndUser_UserId(10, testUserId)).thenReturn(Optional.of(session)); // 🎯 ĐÃ SỬA
        when(aiProvider.streamCompletion(any(), any())).thenThrow(new IOException("Provider failed"));
        when(creditService.recordHoldTransaction(eq(testUserId), anyDouble(), eq("AI completion hold"))).thenReturn(mockTransaction); // 🎯 ĐÃ SỬA

        SseEmitter emitter = new SseEmitter(0L);
        aiService.processCompletion(10, testUserId, null, "prompt text", false, "gpt-4", emitter); // 🎯 ĐÃ SỬA

        verify(creditService).recordHoldTransaction(eq(testUserId), anyDouble(), eq("AI completion hold")); // 🎯 ĐÃ SỬA
        verify(creditService).refundHold(eq("124"), anyDouble());
        verify(creditService, never()).deductCredit(eq("124"), anyDouble(), anyDouble());
    }
}