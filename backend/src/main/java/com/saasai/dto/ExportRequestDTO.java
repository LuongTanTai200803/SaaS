package com.saasai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportRequestDTO {
    private Integer sessionId;
    private String exportFormat;
    private String htmlContent;
}
