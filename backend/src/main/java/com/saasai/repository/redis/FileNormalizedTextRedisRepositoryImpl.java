package com.saasai.repository.redis;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

import java.time.Duration;

@Repository
public class FileNormalizedTextRedisRepositoryImpl implements FileNormalizedTextRedisRepository {

    private static final String KEY_PREFIX = "file:normalized-text:";
    private static final Duration DEFAULT_TTL = Duration.ofHours(1);

    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;
    private final ObjectMapper objectMapper;

    public FileNormalizedTextRedisRepositoryImpl(
            ObjectProvider<StringRedisTemplate> redisTemplateProvider,
            ObjectMapper objectMapper
    ) {
        this.redisTemplateProvider = redisTemplateProvider;
        this.objectMapper = objectMapper;
    }

    @Override
    public void save(String fileId, String normalizedText) {
        validateFileId(fileId);

        if (normalizedText == null) {
            throw new IllegalArgumentException("normalizedText must not be null");
        }

        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) {
            return;
        }
        redis.opsForValue().set(
                buildKey(fileId),
                normalizedText,
                DEFAULT_TTL
        );
    }

    @Override
    public Optional<String> find(String fileId) {
        validateFileId(fileId);

        // Retrieve the normalized text from Redis
        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) {
            return Optional.empty();
        }
        try {
            return Optional.ofNullable(redis.opsForValue().get(buildKey(fileId)
            ));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void delete(String fileId) {
        validateFileId(fileId);

        StringRedisTemplate redis = redisTemplateProvider.getIfAvailable();
        if (redis == null) return;
        redis.delete(
                buildKey(fileId)
        );
    }

    private String buildKey(String fileId) {
        return KEY_PREFIX + fileId;
    }

    private void validateFileId(String fileId) {
        if (fileId == null || fileId.isBlank()) {
            throw new IllegalArgumentException("fileId must not be blank");
        }
    }
}