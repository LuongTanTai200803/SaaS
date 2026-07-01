package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
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


import lombok.RequiredArgsConstructor;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ChatSessionService {
    private static final String DEFAULT_SESSION_NAME = "Cuộc trò chuyện mới";

    private static final String DRAFT_KEY_PATTERN = "chat:session:%s:%d:update";

    private final ChatSessionRepository chatSessionRepository;

    private final StringRedisTemplate redisTemplate;
    
    private final UserRepository userRepository;

    public ChatSessionDTO createSession(String email, ChatSessionCreateRequestDTO request) {
        String currentEmail = resolveCurrentEmail(email);

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        String normalizedSessionName = request.getSessionName() == null || request.getSessionName().trim().isEmpty()
                ? DEFAULT_SESSION_NAME
                : request.getSessionName().trim();

        ChatSession session = ChatSession.builder()
                .user(user)
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

    public void updateEditorContent(Integer sessionId, String email, String htmlContent) {
    // 🎯 Bước A: Tìm userId từ email của ông (hoặc dùng trực tiếp email làm key tùy ông thiết kế)
    // Ở đây tôi ví dụ tìm ra User để lấy userId hệ chuỗi UUID bảo mật của ông nhé
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
            
    // 🎯 Bước B: Bắn thẳng nội dung lên RAM Redis gác cổng, gia hạn tạm lưu 3 ngày
    String key = String.format(DRAFT_KEY_PATTERN, user.getUserId(), sessionId);
    redisTemplate.opsForValue().set(key, htmlContent, Duration.ofDays(3));
    
    // 💡 KHÔNG CẦN gọi chatSessionRepository.save() ở đây nữa! 
    // Trừa lệnh ghi đĩa MySQL đó cho tới khi họ bấm nút "Hoàn tất" hoặc "Xuất file".
    }

    private String resolveCurrentEmail(String fallbackEmail) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof String details && !details.isBlank()) {
            return details;
        }
        return fallbackEmail;
    }

    public ChatSession getSession(Integer sessionId, String userId) {
        return chatSessionRepository.findBySessionIdAndUser_UserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void saveWizardState(Integer sessionId, String userId, String wizardStateJson) {
        ChatSession session = getSession(sessionId, userId);
        session.setWizardStateJson(wizardStateJson);
        chatSessionRepository.save(session);
    }
    // 1. USER GÕ NHÁP: Lưu tạm dữ liệu nháp vào Redis (RAM) để tránh mất mát khi F5 hoặc đóng tab
    public void saveDraft(String userId, String sessionUuid, String content) {

        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));
                
        String key = String.format(DRAFT_KEY_PATTERN, userId, session.getSessionId());
        // Lưu tạm vào Redis và gia hạn 3 ngày tự xóa nếu bỏ xó
        redisTemplate.opsForValue().set(key, content, Duration.ofDays(3));
    }

     // 📥 2. USER VÀO LẠI TRANG: Load dữ liệu dang dở từ Redis (nếu có) hoặc DB (lần đầu vào lại)
    public String loadEditorContent(String userId, String sessionUuid) {
        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        String key = String.format(DRAFT_KEY_PATTERN, userId, session.getSessionId());
        String cachedContent = redisTemplate.opsForValue().get(key);
        
        if (cachedContent != null) {
            return cachedContent;
        }
        
        // Nếu Redis chưa có (lần đầu vào lại), bốc từ DB lên
        String dbContent = session.getHtmlContent();
        if (dbContent == null || dbContent.isBlank()) {
            dbContent = session.getEditorContent();
        }
        return dbContent != null ? dbContent : "";
    }

    // 📥 3. USER BẤM XUẤT FILE: Đóng gói dữ liệu dang dở từ Redis về máy
    public byte[] exportCurrentDraft(String userId, String sessionUuid) {
        // Bước A: Gác cổng tìm kiếm, bốc Object Session bằng chuỗi UUID bảo mật
        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiên chat tương ứng!"));

        // Bước B: Lấy số INT chạy ngầm ra để đi tìm trên Redis cho siêu tốc
        Integer sessionId = session.getSessionId();
        String key = String.format(DRAFT_KEY_PATTERN, userId, sessionId);
        String currentContent = redisTemplate.opsForValue().get(key);

        // Fallback: Nếu Redis trống, lấy nội dung cũ trong DB ra đắp vào
        if (currentContent == null || currentContent.isBlank()) {
            currentContent = session.getHtmlContent();
            if (currentContent == null || currentContent.isBlank()) {
                currentContent = session.getEditorContent();
            }
            if (currentContent == null) currentContent = "";
        }

        return currentContent.getBytes(StandardCharsets.UTF_8);
    }

    // 🏁 4. USER BẤM HOÀN TẤT: Đóng gói gửi sang AI xử lý + Đồng bộ ngược lại MySQL
    public String finalizeAndSendToAi(String userId, String sessionUuid) {
        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiên chat tương ứng!"));
                

        String key = String.format(DRAFT_KEY_PATTERN, userId, session.getSessionId());
        String finalContent = redisTemplate.opsForValue().get(key);

        if (finalContent == null || finalContent.isBlank()) {
            // Nếu bấm hoàn tất luôn mà chưa gõ gì mới ở Redis, lấy nội dung hiện tại trong DB xài luôn
            finalContent = session.getHtmlContent();
            if (finalContent == null || finalContent.isBlank()) {
                throw new IllegalArgumentException("Không có dữ liệu nào để hoàn tất xử lý!");
            }
        }

        // 🧠 TODO: Gửi cục finalContent này sang cho mô hình AI (OpenAI/Gemini) băm xé xử lý ở đây
        String aiResponse = "Kết quả AI xử lý từ đoạn text cuối cùng: " + finalContent;

        // Đồng bộ dữ liệu cuối cùng này xuống MySQL
        session.setHtmlContent(finalContent);
        chatSessionRepository.save(session);

        // Xóa sạch key tạm trên Redis để giải phóng tài nguyên RAM
        redisTemplate.delete(key);

        return aiResponse;
    }
}
