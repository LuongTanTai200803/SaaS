package com.saasai.controller;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.LoginRequestDTO;
import com.saasai.dto.RegisterRequestDTO;
import com.saasai.exception.AuthException;
import com.saasai.security.TokenBlacklistService;
import com.saasai.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<Object>> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.registerUser(request);
        logger.info("User registered successfully: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Tạo tài khoản thành công")
                .statusCode(200)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<Object>> login(@Valid @RequestBody LoginRequestDTO request) {
        Map<String, String> loginResponse = authService.loginUser(request);
        logger.info("User logged in successfully: {}", request.getEmail());
        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Đăng nhập thành công")
                .statusCode(200)
                .data(loginResponse)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Object>> logout(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            logger.warn("Invalid Authorization header received for logout request");
            throw new AuthException("Authorization header không hợp lệ", HttpStatus.BAD_REQUEST);
        }

        String token = bearerToken.substring(7);
        tokenBlacklistService.blacklistToken(token);
        logger.info("User logged out successfully");
        return ResponseEntity.ok(ApiResponseDTO.builder()
                .success(true)
                .message("Đăng xuất thành công")
                .statusCode(200)
                .build());
    }

    public AuthController(AuthService authService, TokenBlacklistService tokenBlacklistService) {
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
}