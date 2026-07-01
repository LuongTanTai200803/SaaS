package com.saasai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.AdminStatsResponseDTO;
import com.saasai.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    void updatePackageShouldReturnSuccess() throws Exception {
        mockMvc.perform(put("/api/v1/admin/packages/PROFESSIONAL")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "price", 199000,
                                "creditLimit", 100,
                                "allowedModels", List.of("deepseek-v4-flash", "gpt-5.4-mini")
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Cập nhật định mức và cấu hình mô hình AI thành công"))
                .andExpect(jsonPath("$.statusCode").value(200));
    }

    @Test
    void getFinanceStatsShouldReturnStats() throws Exception {
        AdminStatsResponseDTO stats = AdminStatsResponseDTO.builder()
                .totalRevenue(158400000L)
                .newUsersCount(142L)
                .activeAffiliates(28L)
                .totalCreditConsumed(45020.0)
                .build();

        when(adminService.getFinanceStats()).thenReturn(stats);

        mockMvc.perform(get("/api/v1/admin/stats/finance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue").value(158400000))
                .andExpect(jsonPath("$.newUsersCount").value(142))
                .andExpect(jsonPath("$.activeAffiliates").value(28))
                .andExpect(jsonPath("$.totalCreditConsumed").value(45020.0));
    }
}
