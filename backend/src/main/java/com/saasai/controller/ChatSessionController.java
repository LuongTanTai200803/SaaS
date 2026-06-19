package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@CrossOrigin(origins = "*")
public class ChatSessionController {
    @Autowired
    private ChatSessionService chatSessionService;

    @PostMapping
    public ResponseEntity<ChatSessionDTO> createSession(@RequestBody ChatSessionCreateRequestDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ChatSessionDTO session = chatSessionService.createSession(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @PutMapping("/{sessionId}/editor")
    public ResponseEntity<ApiResponseDTO<Object>> updateEditorContent(
            @PathVariable Long sessionId,
            @RequestBody EditorContentUpdateDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        chatSessionService.updateEditorContent(sessionId, userId, request.getHtmlContent());

        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Đã lưu bản nháp văn bản thành công")
                .statusCode(200)
                .build());
    }
}
