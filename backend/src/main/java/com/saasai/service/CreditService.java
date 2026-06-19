package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.entity.CreditTransaction;
import com.saasai.repository.CreditTransactionRepository;

@Service
public class CreditService {
    @Autowired
    private CreditTransactionRepository creditTransactionRepository;

    public CreditEstimateResponseDTO estimateCredit(Double inputLength, String outputOption, String model) {
        // Credit calculation logic based on input length and output option
        Double inputCredit = calculateInputCredit(inputLength);
        Double outputCredit = calculateOutputCredit(outputOption);
        Double totalHold = inputCredit + outputCredit;

        return CreditEstimateResponseDTO.builder()
                .inputCreditEstimate(inputCredit)
                .outputCreditEstimate(outputCredit)
                .totalCreditHold(totalHold)
                .build();
    }

    private Double calculateInputCredit(Double inputLength) {
        // 1 credit per 1000 characters
        return (inputLength / 1000) * 0.15;
    }

    private Double calculateOutputCredit(String outputOption) {
        return switch (outputOption) {
            case "SHORT" -> 1.0;
            case "MEDIUM" -> 2.0;
            case "LONG" -> 3.0;
            default -> 1.5;
        };
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
