package com.saasai.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSessionDTO {
    private Long sessionId;
    private String tagId;
    private String sessionName;
    private String currentEditorContent;
    private LocalDateTime createdAt;
}
