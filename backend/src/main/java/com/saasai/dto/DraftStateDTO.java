package com.saasai.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DraftStateDTO {
    private String draftId;
    private Integer sessionId;
    private String userId;
    private String editorText;
    private List<String> fileIds = new ArrayList<>();
    private String status;
    private String wizardStateJson;
    private LocalDateTime updatedAt;

    public DraftStateDTO() {}

    public String getDraftId() { return draftId; }
    public void setDraftId(String draftId) { this.draftId = draftId; }
    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEditorText() { return editorText; }
    public void setEditorText(String editorText) { this.editorText = editorText; }
    public List<String> getFileIds() {
        if (fileIds == null) fileIds = new ArrayList<>();
        return fileIds;
    }
    public void setFileIds(List<String> fileIds) {
        this.fileIds = fileIds != null ? new ArrayList<>(fileIds) : new ArrayList<>();
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getWizardStateJson() { return wizardStateJson; }
    public void setWizardStateJson(String wizardStateJson) { this.wizardStateJson = wizardStateJson; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}