package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.saasai.dto.ChatMessageDTO;
import com.saasai.dto.ChatSessionCreateRequestDTO;
import com.saasai.dto.ChatSessionDTO;
import com.saasai.dto.ChatSessionWorkspaceDTO;
import com.saasai.dto.DraftStateDTO;
import com.saasai.entity.Assistant;
import com.saasai.entity.ChatSession;
import com.saasai.entity.ChatSession.SessionStatus;
import com.saasai.entity.User;
import com.saasai.repository.AssistantRepository;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.repository.UserRepository;
import com.saasai.repository.redis.DraftStateRedisRepository;

import lombok.RequiredArgsConstructor;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatSessionService {
    private static final String DEFAULT_SESSION_NAME = "Cuộc trò chuyện mới";

    private static final String DRAFT_KEY_PATTERN = "chat:session:%s:%d:update";

    private final ChatSessionRepository chatSessionRepository;

    private final StringRedisTemplate redisTemplate;
    
    private final UserRepository userRepository;

    private final AssistantRepository assistantRepository;

    private final DraftStateRedisRepository draftRepository;

    private final ObjectMapper objectMapper;

    public ChatSessionDTO createSession(String email, ChatSessionCreateRequestDTO request) {
        String currentEmail = resolveCurrentEmail(email);

        Assistant assistant = assistantRepository.findById(request.getAssistantId())
        .orElseThrow(() -> new RuntimeException("Trợ lý không tồn tại!"));

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        String normalizedSessionName = request.getSessionName() == null || request.getSessionName().trim().isEmpty()
                ? DEFAULT_SESSION_NAME
                : request.getSessionName().trim();

        ChatSession session = ChatSession.builder()
                .user(user)
                .assistant(assistant)
                .sessionName(normalizedSessionName)
                .editorContent("")
                .htmlContent("")
                .build();

        ChatSession saved = chatSessionRepository.save(session);

        return ChatSessionDTO.builder()
                .sessionUuid(saved.getSessionUuid())
                .tagId(saved.getTagId())
                .sessionName(saved.getSessionName())
                .currentEditorContent(saved.getEditorContent())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    // Lấy workspace của phiên chat, bao gồm nội dung editor và lịch sử chat
    public ChatSessionWorkspaceDTO getWorkspace(String userId, String sessionUuid) {

        ChatSession session = chatSessionRepository
                .findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() ->
                        new NoSuchElementException("Session not found"));

        String editorText = session.getEditorContent();

        if (editorText == null) {
            editorText = "";
        }

        return ChatSessionWorkspaceDTO.builder()
                .sessionUuid(sessionUuid)
                .status(
                        session.getStatus() == null
                                ? ChatSession.SessionStatus.DRAFT.name()
                                : session.getStatus().name()
                )
                .editorText(editorText)
                .messages(
                        parseChatHistoryJson(
                                session.getChatHistoryJson()
                        )
                )
                .build();
    }

    // Phân tích JSON lịch sử chat thành danh sách ChatMessageDTO
    private List<ChatMessageDTO> parseChatHistoryJson(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(
                    json,
                    new TypeReference<List<ChatMessageDTO>>() {}
            );
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Cannot parse chatHistoryJson", e);
        }
    }

    public void updateEditorContent(String sessionUuid, String email, String htmlContent) {
    // 🎯 Bước A: Tìm userId từ email của ông (hoặc dùng trực tiếp email làm key tùy ông thiết kế)
    // Ở đây tôi ví dụ tìm ra User để lấy userId hệ chuỗi UUID bảo mật của ông nhé
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
            
    // 🎯 Bước B: Bắn thẳng nội dung lên RAM Redis gác cổng, gia hạn tạm lưu 3 ngày
    String key = String.format(DRAFT_KEY_PATTERN, user.getUserId(), sessionUuid);
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

    public ChatSession getSession(String sessionUuid, String userId) {
        return chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void saveWizardState(String sessionUuid, String userId, String wizardStateJson) {
        ChatSession session = getSession(sessionUuid, userId);
        session.setWizardStateJson(wizardStateJson);
        chatSessionRepository.save(session);
    }

    // inside ChatSessionService class
    public void saveChatHistory(String sessionUuid, String userId, String chatHistoryJson) {
        ChatSession session = getSession(sessionUuid, userId);
        session.setChatHistoryJson(chatHistoryJson);
        chatSessionRepository.save(session);
    }

    // 1. USER GÕ NHÁP: Lưu tạm dữ liệu nháp vào Redis (RAM) để tránh mất mát khi F5 hoặc đóng tab
    public void saveDraft(String userId, String sessionUuid, String content) {

        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));
                
        String key = String.format(DRAFT_KEY_PATTERN, userId, sessionUuid);
        // Lưu tạm vào Redis và gia hạn 3 ngày tự xóa nếu bỏ xó
        redisTemplate.opsForValue().set(key, content, Duration.ofDays(3));
    }

     // 📥 2. USER VÀO LẠI TRANG: Load dữ liệu dang dở từ Redis (nếu có) hoặc DB (lần đầu vào lại)
    public String loadEditorContent(String userId, String sessionUuid) {
        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        String key = String.format(DRAFT_KEY_PATTERN, userId, sessionUuid);
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
        String key = String.format(DRAFT_KEY_PATTERN, userId, sessionUuid);
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
                

        String key = String.format(DRAFT_KEY_PATTERN, userId, sessionUuid);
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
    private ChatSessionDTO convertToDTO(ChatSession session) {
        return ChatSessionDTO.builder()
                .sessionUuid(session.getSessionUuid())
                .tagId(session.getTagId())
                .sessionName(session.getSessionName())
                .currentEditorContent(session.getEditorContent())
                .createdAt(session.getCreatedAt())
                .editorContent(session.getEditorContent())
                .build();
    }
    public List<ChatSessionDTO> getSessionsByUser(String userId) {

        List<ChatSession> sessions =
                chatSessionRepository.findByUser_UserId(userId);

        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteSession(String sessionUuid, String userId) {
        ChatSession session = chatSessionRepository.findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found or you don't have permission to delete it"));

        chatSessionRepository.delete(session);
    }

	public void saveAiResult(
        Integer sessionId,
        String userId,
        String content
    ) {
        ChatSession session = chatSessionRepository.findBySessionIdAndUser_UserId(sessionId, userId)
                .orElseThrow(() -> new NoSuchElementException("Session not found or you don't have permission to update it"));

        session.setEditorContent(content);
        session.setStatus(SessionStatus.EDITING);

        chatSessionRepository.save(session);

        DraftStateDTO state = new DraftStateDTO();

        state.setEditorText(content);
        state.setStatus("EDITING"); // Ensure consistency with SessionStatus.EDITING

        draftRepository.save(state);
        
    }

    // Lưu trạng thái "Đang chỉnh sửa" khi user mở editor để tránh xung đột với các user khác (nếu có)
    public SessionStatus markEditing(
        Integer sessionId,
        String userId
    ) {
        ChatSession session =
                chatSessionRepository
                        .findBySessionIdAndUser_UserId(
                                sessionId,
                                userId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Session không tồn tại hoặc không thuộc user"
                                )
                        );

        session.setStatus(ChatSession.SessionStatus.EDITING);

        chatSessionRepository.save(session);

        return session.getStatus();
    }

    // Cập nhật tên phiên làm việc của người dùng hiện tại
    public ChatSessionDTO updateSessionName(String userId, String sessionUuid, String sessionName) {
        if (sessionName == null || sessionName.trim().isEmpty()) {
            throw new IllegalArgumentException("sessionName không được để trống");
        }

        ChatSession session = chatSessionRepository
                .findBySessionUuidAndUser_UserId(sessionUuid, userId)
                .orElseThrow(() ->
                        new NoSuchElementException("Session not found or you don't have permission to update it")
                );

        session.setSessionName(sessionName.trim());
        ChatSession saved = chatSessionRepository.save(session);

        return convertToDTO(saved);
    }


}
