package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.saasai.dto.DocumentDTO;
import com.saasai.dto.PaginatedResponseDTO;
import com.saasai.dto.UserProfileDTO;
import com.saasai.entity.User;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.repository.UserRepository;

import java.util.stream.Collectors;

@Service
public class UserService {
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ChatSessionRepository chatSessionRepository;

        public UserProfileDTO getUserProfileByEmail(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return UserProfileDTO.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .agency(user.getAgency())
                                .role(user.getRole().toString())
                                .creditBalance(user.getCreditBalance())
                                .packageType(user.getPackageType() != null ? user.getPackageType().toString() : null)
                                .expireDate(user.getExpireDate())
                                .affiliate(UserProfileDTO.AffiliateDTO.builder()
                                                .code(user.getAffiliateCode())
                                                .link(user.getAffiliateLink())
                                                .totalEarnings(user.getTotalEarnings())
                                                .build())
                                .build();
        }

        public UserProfileDTO getUserProfile(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return UserProfileDTO.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .agency(user.getAgency())
                                .role(user.getRole().toString())
                                .creditBalance(user.getCreditBalance())
                                .packageType(user.getPackageType() != null ? user.getPackageType().toString() : null)
                                .expireDate(user.getExpireDate())
                                .affiliate(UserProfileDTO.AffiliateDTO.builder()
                                                .code(user.getAffiliateCode())
                                                .link(user.getAffiliateLink())
                                                .totalEarnings(user.getTotalEarnings())
                                                .build())
                                .build();
        }

        public PaginatedResponseDTO<DocumentDTO> getUserDocuments(Long userId, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<com.saasai.entity.ChatSession> sessions = chatSessionRepository
                                .findByUserIdOrderByUpdatedAtDesc(userId, pageable);

                return PaginatedResponseDTO.<DocumentDTO>builder()
                                .content(sessions.getContent().stream()
                                                .map(session -> DocumentDTO.builder()
                                                                .sessionId(session.getSessionId())
                                                                .sessionName(session.getSessionName())
                                                                .tagId(session.getTagId())
                                                                .updatedAt(session.getUpdatedAt())
                                                                .status(mapSessionStatus(session.getStatus()))
                                                                .build())
                                                .collect(Collectors.toList()))
                                .totalPages(sessions.getTotalPages())
                                .totalElements(sessions.getTotalElements())
                                .currentPage(page)
                                .pageSize(size)
                                .build();
        }

        public Double updateUserCredit(Long userId, Double creditAmount) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Double currentBalance = user.getCreditBalance() != null ? user.getCreditBalance() : 0.0;
                user.setCreditBalance(currentBalance - creditAmount);
                userRepository.save(user);
                return user.getCreditBalance();
        }

        private String mapSessionStatus(com.saasai.entity.ChatSession.SessionStatus status) {
                if (status == null) {
                        return null;
                }

                return switch (status) {
                        case DRAFT -> "Bản nháp";
                        case ACTIVE -> "Đang xử lý";
                        case COMPLETED -> "Hoàn thành";
                        case ARCHIVED -> "Đã lưu trữ";
                };
        }
}
