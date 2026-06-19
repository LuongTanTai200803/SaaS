package com.saasai.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private Long sessionId;
    private String sessionName;
    private String tagId;
    private LocalDateTime updatedAt;
    private String status;
}
