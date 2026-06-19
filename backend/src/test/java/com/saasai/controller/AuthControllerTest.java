package com.saasai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.exception.AuthException;
import com.saasai.exception.GlobalExceptionHandler;
import com.saasai.security.TokenBlacklistService;
import com.saasai.service.AuthService;
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

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void registerShouldReturnSuccess() throws Exception {
        doNothing().when(authService).registerUser(org.mockito.ArgumentMatchers.any());

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "test@example.com",
                        "fullName", "Nguyen Van A",
                        "password", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Tạo tài khoản thành công"))
                .andExpect(jsonPath("$.statusCode").value(200));
    }

    @Test
    void registerShouldReturnBadRequestWhenEmailExists() throws Exception {
        doThrow(new AuthException("Email đã tồn tại!", org.springframework.http.HttpStatus.BAD_REQUEST)).when(authService)
                .registerUser(org.mockito.ArgumentMatchers.any());

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "test@example.com",
                        "fullName", "Nguyen Van A",
                        "password", "password"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email đã tồn tại!"))
                .andExpect(jsonPath("$.statusCode").value(400));
    }

    @Test
    void loginShouldReturnTokenWhenCredentialsValid() throws Exception {
        when(authService.loginUser(org.mockito.ArgumentMatchers.any()))
                .thenReturn(Map.of("token", "jwt-token", "role", "ROLE_USER"));

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "test@example.com",
                        "password", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.data.token").value("jwt-token"))
                .andExpect(jsonPath("$.data.role").value("ROLE_USER"));
    }

    @Test
    void loginShouldReturnUnauthorizedWhenCredentialsInvalid() throws Exception {
        when(authService.loginUser(org.mockito.ArgumentMatchers.any()))
                .thenThrow(new AuthException("Email hoặc mật khẩu không chính xác", org.springframework.http.HttpStatus.UNAUTHORIZED));

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "test@example.com",
                        "password", "wrong-password"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email hoặc mật khẩu không chính xác"))
                .andExpect(jsonPath("$.statusCode").value(401));
    }

    @Test
    void logoutShouldReturnBadRequestWhenAuthorizationHeaderInvalid() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Authorization header không hợp lệ"))
                .andExpect(jsonPath("$.statusCode").value(400));
    }

    @Test
    void logoutShouldReturnSuccessWhenTokenProvided() throws Exception {
        doNothing().when(tokenBlacklistService).blacklistToken(org.mockito.ArgumentMatchers.anyString());

        mockMvc.perform(post("/api/v1/auth/logout")
                .header("Authorization", "Bearer dummy-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng xuất thành công"))
                .andExpect(jsonPath("$.statusCode").value(200));
    }
}
