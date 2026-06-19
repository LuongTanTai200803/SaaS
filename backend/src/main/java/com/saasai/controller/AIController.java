package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.saasai.dto.AICompletionRequestDTO;
import com.saasai.dto.AIStreamResponseDTO;
import com.saasai.dto.ExportRequestDTO;
import com.saasai.service.AIService;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AIController {
    @Autowired
    private AIService aiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/completions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter processCompletion(@RequestBody AICompletionRequestDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SseEmitter emitter = new SseEmitter(0L);

        CompletableFuture.runAsync(() -> {
            try {
                List<AIStreamResponseDTO> events = aiService.processCompletion(
                        request.getSessionId(),
                        userId,
                        request.getWizardStateJson(),
                        request.getPromptCommand(),
                        request.getPinEditorContext(),
                        request.getModel());

                for (AIStreamResponseDTO event : events) {
                    emitter.send(objectMapper.writeValueAsString(event));
                }

                emitter.complete();
            } catch (IOException e) {
                emitter.completeWithError(e);
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    @PostMapping("/exporter/export")
    public ResponseEntity<byte[]> exportDocument(@RequestBody ExportRequestDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

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
