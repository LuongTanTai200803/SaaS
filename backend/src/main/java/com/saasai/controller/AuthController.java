package com.saasai.controller;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.LoginRequestDTO;
import com.saasai.dto.RegisterRequestDTO;
import com.saasai.exception.AuthException;
import com.saasai.service.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

        private final AuthService authService;

        @PostMapping("/register")
        public ResponseEntity<ApiResponseDTO<Object>> register(@Valid @RequestBody RegisterRequestDTO request) {
                try {
                        authService.registerUser(request);
                        return ResponseEntity.ok(ApiResponseDTO.builder()
                                        .success(true)
                                        .message("Tạo tài khoản thành công")
                                        .statusCode(200)
                                        .build());
                } catch (AuthException e) {
                        return ResponseEntity.badRequest().body(ApiResponseDTO.builder()
                                        .success(false)
                                        .message(e.getMessage())
                                        .build());
                }
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponseDTO<Object>> login(@Valid @RequestBody LoginRequestDTO request) {
                try {
                        Map<String, String> loginResponse = authService.loginUser(request);

                        return ResponseEntity.ok(ApiResponseDTO.builder()
                                        .success(true)
                                        .message("Đăng nhập thành công")
                                        .data(loginResponse)
                                        .build());
                } catch (AuthException e) {
                        return ResponseEntity.status(401).body(ApiResponseDTO.builder()
                                        .success(false)
                                        .message(e.getMessage())
                                        .build());
                }
        }

        public AuthController(AuthService authService) {
                this.authService = authService;
        }
}