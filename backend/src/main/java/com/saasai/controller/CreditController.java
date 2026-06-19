package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.saasai.dto.CreditEstimateDTO;
import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.service.CreditService;

@RestController
@RequestMapping("/api/v1/credits")
@CrossOrigin(origins = "*")
public class CreditController {
    @Autowired
    private CreditService creditService;

    @PostMapping("/estimate")
    public ResponseEntity<CreditEstimateResponseDTO> estimateCredit(@RequestBody CreditEstimateDTO request) {
        CreditEstimateResponseDTO estimate = creditService.estimateCredit(
                request.getInputLength(),
                request.getOutputOption(),
                request.getModelSelected()
        );
        return ResponseEntity.ok(estimate);
    }
}
