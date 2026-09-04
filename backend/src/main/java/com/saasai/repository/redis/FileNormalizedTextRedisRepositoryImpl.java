package com.saasai.repository.redis;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.time.Duration;

@Repository
public class FileNormalizedTextRedisRepositoryImpl implements FileNormalizedTextRedisRepository {

    private static final String KEY_PREFIX = "file:normalized-text:";
    private static final Duration DEFAULT_TTL = Duration.ofHours(1);

    private final StringRedisTemplate redisTemplate;

    public FileNormalizedTextRedisRepositoryImpl(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(String fileId, String normalizedText) {
        validateFileId(fileId);

        if (normalizedText == null) {
            throw new IllegalArgumentException("normalizedText must not be null");
        }

        redisTemplate.opsForValue().set(
                buildKey(fileId),
                normalizedText,
                DEFAULT_TTL
        );
    }

    @Override
    public Optional<String> find(String fileId) {
        validateFileId(fileId);

        // Retrieve the normalized text from Redis
        return Optional.ofNullable(redisTemplate.opsForValue().get(
                buildKey(fileId)
        ));
    }

    @Override
    public void delete(String fileId) {
        validateFileId(fileId);

        redisTemplate.delete(
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