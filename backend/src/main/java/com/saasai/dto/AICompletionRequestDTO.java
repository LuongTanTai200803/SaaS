package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AICompletionRequestDTO {
    private Long sessionId;
    private String wizardStateJson;
    private String promptCommand;
    private Boolean pinEditorContext;
    private String model;
}
