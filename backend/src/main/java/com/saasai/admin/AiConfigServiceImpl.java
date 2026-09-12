package com.saasai.admin;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

@Service
public class AiConfigServiceImpl implements AiConfigService {

    private final ConcurrentMap<String, AiConfigDTO> store = new ConcurrentHashMap<>();

    @Override
    public List<AiConfigDTO> listConfigs() {
        return store.values().stream().collect(Collectors.toList());
    }

    @Override
    public AiConfigDTO upsertConfig(String key, AiConfigRequest req) {
        AiConfigDTO dto = new AiConfigDTO(
                key,
                req.getValue(),
                req.getDescription(),
                LocalDateTime.now()
        );
        store.put(key, dto);
        return dto;
    }
}