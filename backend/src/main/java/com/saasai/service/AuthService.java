package com.saasai.service;

import com.saasai.dto.AuthResponseDTO;
import com.saasai.dto.LoginRequestDTO;
import com.saasai.dto.RegisterRequestDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.RefreshToken;
import com.saasai.entity.User;
import com.saasai.entity.User.UserRole;
import com.saasai.exception.AuthException;
import com.saasai.repository.AdminPackageConfigRepository;
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
    private AdminPackageConfigRepository adminPackageConfigRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    public void registerUser(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email này đã được đăng ký trong hệ thống!");
        }
        AdminPackageConfig freePackage = adminPackageConfigRepository.findByPackageType("FREE")
                    .orElseThrow(() -> new RuntimeException("Gói FREE chưa được khởi tạo dưới DB!"));
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getEmail().split("@")[0])
                .agency("")
                .role(User.UserRole.ROLE_USER)
                .creditBalance(3.0)
                .adminPackageConfig(freePackage) // Gán gói FREE mặc định
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

        String role = user.getRole() != null ? user.getRole().toString() : "ROLE_USER";
        String accessToken = tokenProvider.generateAccessToken(user.getUserId(), user.getEmail(), role);
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .build();
    }

    public String refreshAccessToken(String refreshToken) {
        RefreshToken tokenEntity = refreshTokenService.validateRefreshToken(refreshToken);
        User user = tokenEntity.getUser();
        if (user == null) {
            throw new AuthException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED);
        }

        String userRoleElement = user.getRole() != null ? user.getRole().toString() : UserRole.ROLE_USER.toString();
        return tokenProvider.generateAccessToken(user.getUserId(), user.getEmail(), userRoleElement);
    }
}