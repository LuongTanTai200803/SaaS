package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.context.SecurityContextHolder;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.ChatSessionCreateRequestDTO;
import com.saasai.dto.ChatSessionDTO;
import com.saasai.dto.EditorContentUpdateDTO;
import com.saasai.service.ChatSessionService;

@RestController
@RequestMapping("/api/v1/chat-sessions")
@CrossOrigin
public class ChatSessionController {
    @Autowired
    private ChatSessionService chatSessionService;

    @PostMapping
    public ResponseEntity<ChatSessionDTO> createSession(@RequestBody ChatSessionCreateRequestDTO request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        ChatSessionDTO session = chatSessionService.createSession(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @PutMapping("/{sessionId}/editor")
    public ResponseEntity<ApiResponseDTO<Object>> updateEditorContent(
            @PathVariable String sessionId,
            @RequestBody EditorContentUpdateDTO request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        chatSessionService.updateEditorContent(Integer.parseInt(sessionId), email, request.getHtmlContent());

        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Đã lưu bản nháp văn bản thành công")
                .statusCode(200)
                .build());
    }
    // 🔄 API 2: Load dữ liệu nháp từ Redis/DB khi người dùng F5 tải lại trang
    @GetMapping("/{sessionUuid}/editor")
    public ResponseEntity<String> loadEditorContent(@PathVariable String sessionUuid) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        String content = chatSessionService.loadEditorContent(sessionUuid, email);
        return ResponseEntity.ok(content);
    }

    // 📥 API 3: Bấm nút xuất file dữ liệu dang dở về máy ngay lập tức
    @GetMapping("/{sessionUuid}/export")
    public ResponseEntity<byte[]> exportDraft(@PathVariable String sessionUuid) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        byte[] fileBytes = chatSessionService.exportCurrentDraft(email, sessionUuid);
        
        String fileName = "draft-" + sessionUuid.substring(0, 8) + ".txt";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }

    // 🧠 API 4: Bấm nút Hoàn tất - Đóng gói gửi AI xử lý cuối cùng
    @PostMapping("/{sessionUuid}/finalize")
    public ResponseEntity<String> finalizeDocument(@PathVariable String sessionUuid) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        String aiResult = chatSessionService.finalizeAndSendToAi(email, sessionUuid);
        return ResponseEntity.ok(aiResult);
    }
}
