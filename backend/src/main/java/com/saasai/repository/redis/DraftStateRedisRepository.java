package com.saasai.repository.redis;

import com.saasai.dto.DraftStateDTO;

import java.util.Optional;

public interface DraftStateRedisRepository {
    void save(DraftStateDTO draftState);
    Optional<DraftStateDTO> find(String draftId, String userId);
    void delete(String draftId, String userId);
}