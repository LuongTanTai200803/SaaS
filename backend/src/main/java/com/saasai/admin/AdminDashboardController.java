package com.saasai.admin;

import com.saasai.feature.ai.ApiResponseDTO;
import com.saasai.admin.AdminDashboardDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@CrossOrigin
public class AdminDashboardController {
    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<AdminDashboardDTO>> getOverview() {
        AdminDashboardDTO dto = adminService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponseDTO.success("OK", dto));
    }
}