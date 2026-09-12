package com.saasai.admin;

import com.saasai.feature.ai.ApiResponseDTO;
import com.saasai.feature.payment.PaymentBankConfigDTO;
import com.saasai.feature.payment.PaymentBankConfigRequest;
import com.saasai.feature.payment.PaymentBankConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/payment")
@CrossOrigin
public class PaymentAdminController {
    @Autowired
    private PaymentAdminService paymentAdminService;

    @Autowired
    private PaymentBankConfigService bankConfigService;

    @GetMapping("/invoices")
    public ResponseEntity<ApiResponseDTO<List<InvoiceDTO>>> listInvoices() {
        return ResponseEntity.ok(ApiResponseDTO.success("OK", paymentAdminService.listInvoices()));
    }

    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<ApiResponseDTO<InvoiceDTO>> getInvoice(@PathVariable String invoiceId) {
        return ResponseEntity.ok(ApiResponseDTO.success("OK", paymentAdminService.getInvoice(invoiceId)));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponseDTO<List<TransactionDTO>>> listTransactions() {
        return ResponseEntity.ok(ApiResponseDTO.success("OK", paymentAdminService.listTransactions()));
    }

    @PostMapping("/invoices/{invoiceId}/regenerate-qr")
    public ResponseEntity<ApiResponseDTO<InvoiceDTO>> regenerateQr(@PathVariable String invoiceId) {
        var dto = paymentAdminService.regenerateInvoiceQr(invoiceId);
        return ResponseEntity.ok(ApiResponseDTO.success("Regenerated", dto));
    }

    // Bank config endpoints
    @GetMapping("/bank-config")
    public ResponseEntity<ApiResponseDTO<List<PaymentBankConfigDTO>>> listBankConfig() {
        return ResponseEntity.ok(ApiResponseDTO.success("OK", bankConfigService.listAll()));
    }

    @GetMapping("/bank-config/{id}")
    public ResponseEntity<ApiResponseDTO<PaymentBankConfigDTO>> getBankConfig(@PathVariable Long id) {
        var dto = bankConfigService.getById(id);
        if (dto == null) return ResponseEntity.status(404).body(ApiResponseDTO.failure("Not found"));
        return ResponseEntity.ok(ApiResponseDTO.success("OK", dto));
    }

    @PostMapping("/bank-config")
    public ResponseEntity<ApiResponseDTO<PaymentBankConfigDTO>> createBankConfig(@RequestBody PaymentBankConfigRequest req) {
        var created = bankConfigService.create(req);
        return ResponseEntity.ok(ApiResponseDTO.success("Created", created));
    }

    @PutMapping("/bank-config/{id}")
    public ResponseEntity<ApiResponseDTO<PaymentBankConfigDTO>> updateBankConfig(@PathVariable Long id, @RequestBody PaymentBankConfigRequest req) {
        var updated = bankConfigService.update(id, req);
        return ResponseEntity.ok(ApiResponseDTO.success("Updated", updated));
    }

    @PostMapping("/bank-config/{id}/activate")
    public ResponseEntity<ApiResponseDTO<PaymentBankConfigDTO>> activateBankConfig(@PathVariable Long id) {
        var dto = bankConfigService.activate(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Activated", dto));
    }

    @DeleteMapping("/bank-config/{id}")
    public ResponseEntity<ApiResponseDTO<Object>> deleteBankConfig(@PathVariable Long id) {
        bankConfigService.delete(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Deleted", null));
    }
}