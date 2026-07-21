package com.saasai.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenRouterChoiceErrorDTO(
        Integer code,
        String message
) {
}