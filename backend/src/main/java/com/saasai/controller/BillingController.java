package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import com.saasai.dto.BillingInvoiceDTO;
import com.saasai.dto.BillingInvoiceRequestDTO;
import com.saasai.service.BillingService;

@RestController
@RequestMapping("/api/v1/billing")
@CrossOrigin(origins = "*")
public class BillingController {
    @Autowired
    private BillingService billingService;

    @PostMapping("/invoice")
    public ResponseEntity<BillingInvoiceDTO> createInvoice(@RequestBody BillingInvoiceRequestDTO request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        BillingInvoiceDTO invoice = billingService.createInvoice(
                userId,
                request.getPackageType(),
                request.getDurationMonths());

        return ResponseEntity.ok(invoice);
    }
}
