package com.saasai.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AICompletionRequestDTO {

    private Integer sessionId;

    private String wizardStateJson;

    private String promptCommand;

    private Boolean pinEditorContext;

    private String model;

    /**
     * Danh sách file được đính kèm trong prompt.
     * Hỗ trợ cả "file_xxx" hoặc UUID.
     */
    private List<String> fileIds;
}