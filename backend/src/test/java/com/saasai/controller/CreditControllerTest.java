package com.saasai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.CreditEstimateResponseDTO;
import com.saasai.service.CreditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CreditControllerTest {

    @Mock
    private CreditService creditService;

    @InjectMocks
    private CreditController creditController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(creditController).build();
    }

    @Test
    void estimateCreditShouldReturnEstimate() throws Exception {
        CreditEstimateResponseDTO response = CreditEstimateResponseDTO.builder()
                .inputCreditEstimate(1.5)
                .outputCreditEstimate(3.0)
                .totalCreditHold(4.5)
                .build();

        when(creditService.estimateCredit(12500.0, "LONG", "claude-sonnet-4.6")).thenReturn(response);

        mockMvc.perform(post("/api/v1/credits/estimate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "inputLength", 12500.0,
                                "outputOption", "LONG",
                                "modelSelected", "claude-sonnet-4.6"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.inputCreditEstimate").value(1.5))
                .andExpect(jsonPath("$.outputCreditEstimate").value(3.0))
                .andExpect(jsonPath("$.totalCreditHold").value(4.5));
    }
}
