package com.saasai.repository.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.DraftStateDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
public class DraftStateRedisRepositoryImpl implements DraftStateRedisRepository {

    private static final String KEY_PATTERN = "draft:user:%s:%s";

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final Duration ttl;

    public DraftStateRedisRepositoryImpl(
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper,
            @Value("${app.redis.draft-ttl-hours:72}") long ttlHours
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.ttl = Duration.ofHours(ttlHours);
    }

    @Override
    public void save(DraftStateDTO draftState) {
        validate(draftState.getSessionUuid(), draftState.getUserId());

        try {
            String json = objectMapper.writeValueAsString(draftState);
            redisTemplate.opsForValue().set(
                    buildKey(draftState.getSessionUuid(), draftState.getUserId()),
                    json,
                    ttl
            );
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Không thể serialize draft state", exception);
        }
    }

    @Override
    public Optional<DraftStateDTO> find(String sesisonUuid, String userId) {
        validate(sesisonUuid, userId);

        String json = redisTemplate.opsForValue().get(buildKey(sesisonUuid, userId));
        if (json == null || json.isBlank()) {
            return Optional.empty();
        }

        try {
            return Optional.of(objectMapper.readValue(json, DraftStateDTO.class));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Không thể deserialize draft state", exception);
        }
    }

    // @Override
    // public Optional<DraftStateDTO> find(Integer sesisonId, String userId) {
    //     validate(sesisonUuid, userId);

    //     String json = redisTemplate.opsForValue().get(buildKey(sesisonUuid, userId));
    //     if (json == null || json.isBlank()) {
    //         return Optional.empty();
    //     }

    //     try {
    //         return Optional.of(objectMapper.readValue(json, DraftStateDTO.class));
    //     } catch (JsonProcessingException exception) {
    //         throw new IllegalStateException("Không thể deserialize draft state", exception);
    //     }
    // }


    @Override
    public void delete(String sessionUuid, String userId) {
        validate(sessionUuid, userId);
        redisTemplate.delete(buildKey(sessionUuid, userId));
    }

    private String buildKey(String sessionUuid, String userId) {
        return String.format(KEY_PATTERN, userId.trim(), sessionUuid.toString());
    }

    private void validate(String sessionUuid, String userId) {
        if (sessionUuid == null) {
            throw new IllegalArgumentException("sessionId không được để trống");
        }
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId không được để trống");
        }
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId không được để trống");
        }
    }
}