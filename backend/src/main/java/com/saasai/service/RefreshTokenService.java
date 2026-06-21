package com.saasai.service;

import com.saasai.entity.RefreshToken;
import com.saasai.exception.AuthException;
import com.saasai.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public String createRefreshToken(String email) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .userEmail(email)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED));

        if (refreshToken.getRevoked() != null && refreshToken.getRevoked()) {
            throw new AuthException("Refresh token đã bị thu hồi", HttpStatus.UNAUTHORIZED);
        }
        if (refreshToken.isExpired()) {
            throw new AuthException("Refresh token đã hết hạn", HttpStatus.UNAUTHORIZED);
        }
        return refreshToken;
    }

    @Transactional
    public void revokeAllByEmail(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        refreshTokenRepository.deleteByUserEmail(email);
    }
}
