package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.saasai.dto.AdminPackageUpdateDTO;
import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.dto.ApiResponseDTO;
import com.saasai.service.AdminService;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PutMapping("/packages/{packageType}")
    public ResponseEntity<ApiResponseDTO<Object>> updatePackageConfig(
            @PathVariable String packageType,
            @RequestBody AdminPackageUpdateDTO request) {

        adminService.upsertPackageConfig(packageType, request);
        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Cập nhật định mức và cấu hình mô hình AI thành công")
                .statusCode(200)
                .build());
    }

    @GetMapping("/stats/finance")
    public ResponseEntity<AdminStatsResponseDTO> getFinanceStats() {
        AdminStatsResponseDTO stats = adminService.getFinanceStats();
        return ResponseEntity.ok(stats);
    }
}
