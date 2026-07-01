package com.saasai.service;

import com.saasai.dto.CreditEstimateDTO;
import com.saasai.dto.CreditEstimateResponseDTO;

import com.saasai.entity.CreditTransaction;
import com.saasai.entity.FileMetadata;
import com.saasai.entity.User;

import com.saasai.repository.CreditTransactionRepository;
import com.saasai.repository.FileMetadataRepository;
import com.saasai.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.saasai.exception.AuthException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
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
    private FileMetadataRepository fileUploadRepository;

    public CreditEstimateResponseDTO estimateCredits(CreditEstimateDTO request) {
        User currentUser = userRepository.findByEmail(resolveCurrentEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        String modelName = request.getModelName() != null ? request.getModelName() : request.getModelSelected();
        List<String> features = request.getFeatures() != null ? request.getFeatures() : deriveLegacyFeatures(request);
        double legacyLengthCost = request.getInputLength() != null ? calculateLegacyLengthCost(request.getInputLength())
                : 0.0;

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

    private double calculateFileCost(String rawFileId, User currentUser) {
        if (rawFileId == null || rawFileId.isBlank()) {
            throw new AuthException("file_id is required", HttpStatus.UNAUTHORIZED);
        }
        
        String fileId = parseFileId(rawFileId);
        FileMetadata fileUpload = fileUploadRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Tệp không tồn tại"));

        if (fileUpload.getUser() == null || !fileUpload.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền sử dụng tệp này");
        }

        double fileSizeInMb = fileUpload.getFileSize() == null ? 0.0 : fileUpload.getFileSize() / (1024.0 * 1024.0);
        return roundOneDecimal(Math.max(0.5, Math.ceil(fileSizeInMb)));
    }

    private double calculateLegacyLengthCost(Double inputLength) {
        return roundOneDecimal((inputLength / 1000.0) * 0.15);
    }

    private double calculateFeatureCost(java.util.List<java.lang.String> features) {
        if (features == null || features.isEmpty()) {
            return 0.0;
        }
        return roundOneDecimal(features.size() * 0.75);
    }

    private String parseFileId(String rawFileId) {
        String normalized = rawFileId.startsWith("file_") ? rawFileId.substring(5) : rawFileId;
        try {
            return String.valueOf(Long.parseLong(normalized));
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

    public CreditTransaction recordHoldTransaction(String userId, Double totalHold, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        CreditTransaction transaction = CreditTransaction.builder()
                .user(user)
                .totalCreditHold(totalHold)
                .description(description)
                .type(CreditTransaction.TransactionType.HOLD)
                .build();

        return creditTransactionRepository.save(transaction);
    }

    @Transactional
    public void deductCredit(String transactionId, Double actualDeducted, Double refunded) {
        CreditTransaction transaction = creditTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction không tồn tại"));

        User user = userRepository.findById(transaction.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        double currentBalance = user.getCreditBalance() != null ? user.getCreditBalance() : 0.0;
        user.setCreditBalance(currentBalance - (actualDeducted != null ? actualDeducted : 0.0));
        userRepository.save(user);

        transaction.setActualCreditDeducted(actualDeducted);
        transaction.setRefundedCredit(refunded);
        transaction.setType(CreditTransaction.TransactionType.DEDUCT);
        creditTransactionRepository.save(transaction);
    }

    @Transactional
    public void refundHold(String transactionId, Double refunded) {
        CreditTransaction transaction = creditTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction không tồn tại"));
        transaction.setRefundedCredit(refunded);
        transaction.setActualCreditDeducted(0.0);
        transaction.setType(CreditTransaction.TransactionType.REFUND);
        creditTransactionRepository.save(transaction);
    }
}
