package com.saasai.admin;

import com.saasai.feature.ai.ApiResponseDTO;
import com.saasai.admin.AiConfigDTO;
import com.saasai.admin.AiConfigRequest;
import com.saasai.admin.AiConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/ai")
@CrossOrigin
public class SystemAiAdminController {
    @Autowired
    private AiConfigService aiConfigService;

    @GetMapping("/configs")
    public ResponseEntity<ApiResponseDTO<List<AiConfigDTO>>> listConfigs() {
        return ResponseEntity.ok(ApiResponseDTO.success("OK", aiConfigService.listConfigs()));
    }

    @PutMapping("/configs/{key}")
    public ResponseEntity<ApiResponseDTO<AiConfigDTO>> upsertConfig(@PathVariable String key, @RequestBody AiConfigRequest req) {
        return ResponseEntity.ok(ApiResponseDTO.success("Updated", aiConfigService.upsertConfig(key, req)));
    }
}