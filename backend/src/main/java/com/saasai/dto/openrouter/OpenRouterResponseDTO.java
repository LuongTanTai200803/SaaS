package com.saasai.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenRouterResponseDTO(
        String id,
        String model,
        List<OpenRouterChoiceDTO> choices,
        OpenRouterUsageDTO usage
) {
}