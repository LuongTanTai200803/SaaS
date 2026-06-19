package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSessionCreateRequestDTO {
    private String tagId;
    private String sessionName;
}
