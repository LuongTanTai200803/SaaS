package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.saasai.dto.CreditEstimateDTO;
import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.entity.CreditTransaction;
import com.saasai.entity.FileUpload;
import com.saasai.entity.User;
import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.FileUploadRepository;
import com.saasai.repository.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
public class CreditService {
    @Autowired
    private CreditTransactionRepository creditTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadRepository fileUploadRepository;

    public CreditEstimateResponseDTO estimateCredits(CreditEstimateDTO request) {
        User currentUser = userRepository.findByEmail(resolveCurrentEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        String modelName = request.getModelName() != null ? request.getModelName() : request.getModelSelected();
        List<String> features = request.getFeatures() != null ? request.getFeatures() : deriveLegacyFeatures(request);
        double legacyLengthCost = request.getInputLength() != null ? calculateLegacyLengthCost(request.getInputLength()) : 0.0;

        double modelCost = calculateModelCost(modelName);
        double featureCost = calculateFeatureCost(features) + legacyLengthCost;
        double fileCost = calculateFileCost(request.getFileId(), currentUser);
        double estimatedCredits = roundOneDecimal(modelCost + featureCost + fileCost);
        double currentCredits = currentUser.getCreditBalance() != null ? currentUser.getCreditBalance() : 0.0;

        return CreditEstimateResponseDTO.builder()
                .estimatedCredits(estimatedCredits)
                .currentCredits(currentCredits)
                .isEligible(currentCredits >= estimatedCredits)
                .inputCreditEstimate(roundOneDecimal(modelCost + legacyLengthCost))
                .outputCreditEstimate(roundOneDecimal(featureCost - legacyLengthCost + fileCost))
                .totalCreditHold(estimatedCredits)
                .build();
    }

    private List<String> deriveLegacyFeatures(CreditEstimateDTO request) {
        if (request.getOutputOption() == null) {
            return Collections.emptyList();
        }
        return List.of(request.getOutputOption());
    }

    private double calculateModelCost(String modelName) {
        if (modelName == null || modelName.isBlank()) {
            return 3.0;
        }

        String normalized = modelName.toLowerCase(Locale.ROOT);
        if (normalized.contains("opus") || normalized.contains("gpt-5") || normalized.contains("o1")) {
            return 6.0;
        }
        if (normalized.contains("sonnet") || normalized.contains("gpt-4")) {
            return 4.0;
        }
        if (normalized.contains("haiku") || normalized.contains("mini")) {
            return 2.0;
        }
        return 3.0;
    }

    private double calculateFeatureCost(List<String> features) {
        if (features == null || features.isEmpty()) {
            return 0.0;
        }
        return roundOneDecimal(features.size() * 0.75);
    }

    private double calculateLegacyLengthCost(Double inputLength) {
        return roundOneDecimal((inputLength / 1000.0) * 0.15);
    }

    private double calculateFileCost(String rawFileId, User currentUser) {
        if (rawFileId == null || rawFileId.isBlank()) {
            return 0.0;
        }

        Long fileId = parseFileId(rawFileId);
        FileUpload fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Tệp không tồn tại"));

        if (!fileUpload.getUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Bạn không có quyền sử dụng tệp này để ước tính credit");
        }

        double fileSizeInMb = fileUpload.getFileSize() == null ? 0.0 : fileUpload.getFileSize() / (1024.0 * 1024.0);
        return roundOneDecimal(Math.max(0.5, Math.ceil(fileSizeInMb)));
    }

    private Long parseFileId(String rawFileId) {
        String normalized = rawFileId.startsWith("file_") ? rawFileId.substring(5) : rawFileId;
        try {
            return Long.parseLong(normalized);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("fileId không hợp lệ");
        }
    }

    private String resolveCurrentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Không tìm thấy thông tin đăng nhập");
        }
        if (authentication.getDetails() instanceof String details && !details.isBlank()) {
            return details;
        }
        String name = authentication.getName();
        if (name != null && !name.isBlank() && !"anonymousUser".equalsIgnoreCase(name)) {
            return name;
        }
        throw new RuntimeException("Không tìm thấy email người dùng hiện tại");
    }

    private double roundOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    public void recordTransaction(Long userId, Double inputCredit, Double outputCredit, Double totalHold, String description) {
        CreditTransaction transaction = CreditTransaction.builder()
                .userId(userId)
                .inputCredit(inputCredit)
                .outputCredit(outputCredit)
                .totalCreditHold(totalHold)
                .type(CreditTransaction.TransactionType.HOLD)
                .description(description)
                .build();

        creditTransactionRepository.save(transaction);
    }

    public void deductCredit(Long transactionId, Double actualDeducted, Double refunded) {
        // Update transaction with actual deduction and refund
    }
}
