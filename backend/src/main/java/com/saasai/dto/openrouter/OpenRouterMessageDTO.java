package com.saasai.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenRouterMessageDTO(
        String role,
        String content
) {
    public static OpenRouterMessageDTO system(String content) {
        return new OpenRouterMessageDTO("system", content);
    }

    public static OpenRouterMessageDTO user(String content) {
        return new OpenRouterMessageDTO("user", content);
    }

    public static OpenRouterMessageDTO assistant(String content) {
        return new OpenRouterMessageDTO("assistant", content);
    }
}