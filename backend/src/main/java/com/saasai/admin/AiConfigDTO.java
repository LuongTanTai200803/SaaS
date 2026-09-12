package com.saasai.admin;

import java.time.LocalDateTime;

public record AiConfigDTO(
    String key,
    String value,
    String description,
    LocalDateTime updatedAt
) {}