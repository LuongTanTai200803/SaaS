package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.saasai.dto.DocumentDTO;
import com.saasai.dto.PaginatedResponseDTO;
import com.saasai.dto.UserProfileDTO;
import com.saasai.entity.FileMetadata;
import com.saasai.entity.User;
import com.saasai.repository.ChatSessionRepository;
import com.saasai.repository.UserRepository;
import com.saasai.repository.FileMetadataRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ChatSessionRepository chatSessionRepository;

        @Autowired
        private FileMetadataRepository fileUploadRepository;

        public UserProfileDTO getUserProfileByEmail(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return UserProfileDTO.builder()
                                .userId(user.getUserId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .agency(user.getAgency())
                                .role(user.getRole().toString())
                                .creditBalance(user.getCreditBalance())
                                .packageType(user.getAdminPackageConfig() != null
                                                ? user.getAdminPackageConfig().toString()
                                                : null)
                                .expireDate(user.getExpireDate())
                                .affiliate(UserProfileDTO.AffiliateDTO.builder()
                                                .code(user.getAffiliateCode())
                                                .link(user.getAffiliateLink())
                                                .totalEarnings(user.getTotalEarnings())
                                                .build())
                                .build();
        }

        public UserProfileDTO getUserProfile(String userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return UserProfileDTO.builder()
                                .userId(user.getUserId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .agency(user.getAgency())
                                .role(user.getRole().toString())
                                .creditBalance(user.getCreditBalance())
                                .packageType(user.getAdminPackageConfig() != null
                                                ? user.getAdminPackageConfig().toString()
                                                : null)
                                .expireDate(user.getExpireDate())
                                .affiliate(UserProfileDTO.AffiliateDTO.builder()
                                                .code(user.getAffiliateCode())
                                                .link(user.getAffiliateLink())
                                                .totalEarnings(user.getTotalEarnings())
                                                .build())
                                .build();
        }

        public User getUserById(String userId) {
                return userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        public PaginatedResponseDTO<DocumentDTO> getUserDocuments(String userId, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<com.saasai.entity.ChatSession> sessions = chatSessionRepository
                                .findByUser_UserIdOrderByUpdatedAtDesc(userId, pageable);

                return PaginatedResponseDTO.<DocumentDTO>builder()
                                .content(sessions.getContent().stream()
                                                .map(session -> DocumentDTO.builder()
                                                                .sessionId(session.getSessionId() != null
                                                                                ? String.valueOf(session.getSessionId())
                                                                                : null)
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

        public PaginatedResponseDTO<DocumentDTO> getUserDocumentsByUserEmail(String email, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<FileMetadata> files = fileUploadRepository.findByUserEmail(email, pageable);

                // Ép kiểu tường minh để tránh lỗi suy luận kiểu (type inference)
                List<DocumentDTO> documentList = files.getContent().stream()
                                .map(file -> DocumentDTO.builder()
                                                .sessionId(file.getFileId() != null
                                                                ? String.valueOf(file.getFileId())
                                                                : null)
                                                .sessionName(file.getFileName())
                                                .tagId(file.getCategory() != null
                                                                ? file.getCategory().name()
                                                                : null)
                                                .updatedAt(file.getUploadedAt())
                                                .status(file.getMimeType())
                                                .build())
                                .collect(Collectors.toList());

                return PaginatedResponseDTO.<DocumentDTO>builder()
                                .content(documentList)
                                .totalPages(files.getTotalPages())
                                .totalElements(files.getTotalElements())
                                .currentPage(page)
                                .pageSize(size)
                                .build();
        }

        public Double updateUserCredit(String userId, Double creditAmount) {
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
