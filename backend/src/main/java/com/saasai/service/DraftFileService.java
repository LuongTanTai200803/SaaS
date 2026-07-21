package com.saasai.service;

import com.saasai.dto.DraftStateDTO;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.repository.redis.DraftStateRedisRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DraftFileService {

    private final DraftStateRedisRepository draftRepository;
    private final FileTextService fileTextService;
    private final ChatSessionRepository chatSessionRepository;

    public DraftFileService(
            DraftStateRedisRepository draftRepository,
            FileTextService fileTextService,
            ChatSessionRepository chatSessionRepository
    ) {
        this.draftRepository = draftRepository;
        this.fileTextService = fileTextService;
        this.chatSessionRepository = chatSessionRepository;
    }

    public DraftStateDTO saveDraftState(
            String draftId,
            String userId,
            Integer sessionId,
            String editorText,
            List<String> fileIds,
            String status,
            String wizardStateJson
    ) {
        String normalizedDraftId = requireText(draftId, "draftId");
        String normalizedUserId = requireText(userId, "userId");

        validateSessionOwnership(sessionId, normalizedUserId);

        DraftStateDTO state = new DraftStateDTO();
        state.setDraftId(normalizedDraftId);
        state.setUserId(normalizedUserId);
        state.setSessionId(sessionId);
        state.setEditorText(editorText == null ? "" : editorText);
        state.setFileIds(normalizeFileIds(fileIds));
        state.setStatus(status == null || status.isBlank() ? "EDITING" : status.trim().toUpperCase());
        state.setWizardStateJson(wizardStateJson);
        state.setUpdatedAt(LocalDateTime.now());

        draftRepository.save(state);
        return state;
    }

    public DraftStateDTO loadDraftState(String draftId, String userId) {
        return draftRepository.find(
                        requireText(draftId, "draftId"),
                        requireText(userId, "userId")
                )
                .orElseThrow(() -> new NoSuchElementException(
                        "Draft không tồn tại hoặc đã hết hạn"
                ));
    }

    public String finalizeDraftAndBuildPrompt(String draftId, String userId) {
        DraftStateDTO draft = loadDraftState(draftId, userId);

        validateSessionOwnership(draft.getSessionId(), userId);

        String mergedPrompt = mergeEditorAndFiles(
                draft.getEditorText(),
                draft.getFileIds(),
                userId
        );

        if (mergedPrompt.isBlank()) {
            throw new IllegalArgumentException("Draft không có nội dung để hoàn tất");
        }

        draft.setStatus("FINALIZED");
        draft.setUpdatedAt(LocalDateTime.now());
        draftRepository.save(draft);

        return mergedPrompt;
    }

    public String mergeEditorAndFiles(
            String editorText,
            List<String> fileIds,
            String userId
    ) {
        String normalizedUserId = requireText(userId, "userId");
        StringBuilder prompt = new StringBuilder();

        if (editorText != null && !editorText.isBlank()) {
            prompt.append("[EDITOR_CONTENT]\n")
                    .append(editorText.trim())
                    .append("\n\n");
        }

        List<String> normalizedIds = normalizeFileIds(fileIds);

        for (int index = 0; index < normalizedIds.size(); index++) {
            String fileId = normalizedIds.get(index);
            String text = fileTextService.getNormalizedText(fileId, normalizedUserId);

            prompt.append("[UPLOADED_FILE_")
                    .append(index + 1)
                    .append("]\n")
                    .append("fileId: ")
                    .append(fileId)
                    .append("\n")
                    .append(text == null ? "" : text.trim())
                    .append("\n\n");
        }

        return prompt.toString().trim();
    }

    public void deleteDraft(String draftId, String userId) {
        draftRepository.delete(
                requireText(draftId, "draftId"),
                requireText(userId, "userId")
        );
    }

    private void validateSessionOwnership(Integer sessionId, String userId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("sessionId không được null");
        }

        chatSessionRepository.findBySessionIdAndUser_UserId(sessionId, userId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Session không tồn tại hoặc không thuộc user"
                ));
    }

    private List<String> normalizeFileIds(List<String> fileIds) {
        if (fileIds == null || fileIds.isEmpty()) {
            return new ArrayList<>();
        }

        LinkedHashSet<String> uniqueIds = new LinkedHashSet<>();

        for (String fileId : fileIds) {
            if (fileId == null || fileId.isBlank()) {
                continue;
            }

            String normalized = fileId.trim();

            if (normalized.startsWith("file_")) {
                normalized = normalized.substring("file_".length());
            }

            uniqueIds.add(normalized);
        }

        return new ArrayList<>(uniqueIds);
    }

    private String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " không được để trống");
        }

        return value.trim();
    }
}