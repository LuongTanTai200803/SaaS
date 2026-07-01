package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.saasai.dto.AICompletionRequestDTO;
import com.saasai.dto.ExportRequestDTO;
import com.saasai.service.AIService;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin
public class AIController {
    @Autowired
    private AIService aiService;

    @PostMapping(value = "/completions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter processCompletion(@RequestBody AICompletionRequestDTO request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SseEmitter emitter = new SseEmitter(0L);

        CompletableFuture.runAsync(() -> {
            try {
                aiService.processCompletion(
                        request.getSessionId(),
                        userId,
                        request.getWizardStateJson(),
                        request.getPromptCommand(),
                        request.getPinEditorContext(),
                        request.getModel(),
                        emitter);
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    @PostMapping("/exporter/export")
    public ResponseEntity<byte[]> exportDocument(@RequestBody ExportRequestDTO request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        byte[] fileContent = aiService.exportDocument(
                request.getSessionId(),
                userId,
                request.getExportFormat());

        String fileName = "document." + request.getExportFormat().toLowerCase();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(fileContent);
    }
}
