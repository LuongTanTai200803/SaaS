package com.saasai.service;

import com.saasai.dto.AuthResponseDTO;
import com.saasai.dto.LoginRequestDTO;
import com.saasai.dto.RegisterRequestDTO;
import com.saasai.entity.RefreshToken;
import com.saasai.entity.User;
import com.saasai.exception.AuthException;
import com.saasai.repository.UserRepository;
import com.saasai.security.JwtTokenProvider;
import com.saasai.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenService refreshTokenService;

    public void registerUser(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email này đã được đăng ký trong hệ thống!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getEmail().split("@")[0])
                .agency("")
                .role(User.UserRole.ROLE_USER)
                .creditBalance(3.0)
                .packageType(User.PackageType.FREE)
                .expireDate(LocalDateTime.now().plusDays(30))
                .build();
        userRepository.save(user);
    }

    public AuthResponseDTO loginUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        }

        String role = user.getRole().toString();
        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), role);
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .build();
    }

    public String refreshAccessToken(String refreshToken) {
        RefreshToken tokenEntity = refreshTokenService.validateRefreshToken(refreshToken);
        User user = userRepository.findByEmail(tokenEntity.getUserEmail())
                .orElseThrow(() -> new AuthException("Không tìm thấy người dùng", HttpStatus.UNAUTHORIZED));

        String role = user.getRole() != null ? user.getRole().toString() : "ROLE_USER";
        return tokenProvider.generateAccessToken(user.getId(), user.getEmail(), role);
    }
}