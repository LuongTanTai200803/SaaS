package com.saasai.admin;

import com.saasai.admin.AiConfigDTO;
import com.saasai.admin.AiConfigRequest;
import java.util.List;

public interface AiConfigService {
    List<AiConfigDTO> listConfigs();
    AiConfigDTO upsertConfig(String key, AiConfigRequest req);
}