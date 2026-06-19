package com.saasai.service;

import com.saasai.dto.LoginRequestDTO;
import com.saasai.dto.RegisterRequestDTO;
import com.saasai.entity.User;
import com.saasai.exception.AuthException;
import com.saasai.repository.UserRepository;
import com.saasai.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void registerUser(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email đã tồn tại!");
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

    public Map<String, String> loginUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Email hoặc mật khẩu không chính xác");
        }

        String role = user.getRole().toString();
        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), role);

        return Map.of("token", token, "role", role);
    }
}