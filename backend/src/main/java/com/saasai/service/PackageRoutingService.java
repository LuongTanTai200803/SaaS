package com.saasai.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import com.saasai.dto.ModelRoute;
import com.saasai.repository.UserRepository;
import com.saasai.repository.AdminPackageConfigRepository;
import com.saasai.entity.User;
import com.saasai.entity.AdminPackageConfig;
import org.springframework.beans.factory.annotation.Value;



@Service
public class PackageRoutingService {

        @Value("${ai.max-tokens:2000}")
        private int configuredMaxTokens;
        @Value("${ai.temperature:0}")
        private double configuredTemperature;

        private static final int DEFAULT_MAX_TOKENS = Integer.parseInt(System.getProperty("AI_MAX_TOKENS", "2000"));
        private static final double DEFAULT_TEMPERATURE = Double.parseDouble(System.getProperty("AI_TEMPERATURE", "0"));

        
        private final ObjectMapper objectMapper;

        public PackageRoutingService(ObjectMapper objectMapper) {
                this.objectMapper = objectMapper;
        }

        @Transactional(readOnly = true)
        public ModelRoute resolveRoute(User user) {

                if (user == null) {
                        throw new IllegalArgumentException(
                                "Thông tin người dùng không được để trống"
                        );
                }

                AdminPackageConfig packageConfig =
                        user.getAdminPackageConfig();

                if (packageConfig == null) {
                        throw new IllegalStateException(
                                "Người dùng chưa được gán gói dịch vụ"
                        );
                }

                List<String> allowedModels =
                        parseAllowedModels(
                                packageConfig.getAllowedModels()
                        );

                if (allowedModels.isEmpty()) {
                        throw new IllegalStateException(
                                "Gói hiện tại chưa được cấu hình model"
                        );
                }

                String primaryModel =
                        validateModelId(
                                allowedModels.get(0)
                        );

                String fallbackModel =
                        allowedModels.size() > 1
                                ? validateModelId(
                                        allowedModels.get(1)
                                )
                                : null;

                return new ModelRoute(
                        primaryModel,
                        fallbackModel,
                        configuredMaxTokens > 0 ? configuredMaxTokens : DEFAULT_MAX_TOKENS,
                        configuredTemperature >= 0 ? configuredTemperature : DEFAULT_TEMPERATURE
                );
        }

        // Phương thức parseAllowedModels và normalizeModelId được sử dụng để xử lý danh sách model được phép từ cấu hình gói dịch vụ.
        private List<String> parseAllowedModels(String json) {
                if (json == null || json.isBlank()) {
                return List.of();
                }

                try {
                return objectMapper.readValue(
                        json,
                        new TypeReference<List<String>>() {}
                );
                } catch (JsonProcessingException exception) {
                throw new IllegalStateException(
                        "allowed_models không đúng định dạng JSON",
                        exception
                );
                }
        }

        private String validateModelId(String model) {
                if (model == null || model.isBlank()) {
                        throw new IllegalStateException(
                                "Model trong allowed_models không hợp lệ"
                        );
                }

                return model.trim();
                }
        }