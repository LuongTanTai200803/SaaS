package com.saasai.dto;

/**
 * ModelRoute
 */
public record ModelRoute(
        String primaryModel,
        String fallbackModel,
        Integer maxTokens,
        Double temperature
) {}