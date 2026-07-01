package com.saasai.service;

import com.saasai.dto.FileMetadataResponseDTO;
import com.saasai.entity.AdminPackageConfig;
import com.saasai.entity.FileMetadata;
import com.saasai.entity.User;
import com.saasai.repository.FileMetadataRepository;
import com.saasai.repository.UserRepository;
import com.saasai.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

@Service
public class FileService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "txt");

    @Autowired
    private FileMetadataRepository fileUploadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private StorageService storageService;

    @Value("${storage.base-url:http://localhost:8080/uploads/}")
    private String storageBaseUrl;

    public FileMetadataResponseDTO uploadFile(MultipartFile file, String category) throws IOException {
        User currentUser = userRepository.findByEmail(resolveCurrentEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        validateFile(file);
        enforceStorageQuota(currentUser, file.getSize());

        String originalFileName = file.getOriginalFilename();
        String storedFileName = buildStoredFileName(originalFileName);
        FileMetadata.FileCategory fileCategory = normalizeCategory(category);

        storageService.storeFile(file, storedFileName);

        FileMetadata fileUpload = FileMetadata.builder()
                .user(currentUser)
                .fileName(originalFileName)
                .fileUrl(storageBaseUrl + storedFileName)
                .fileSize(file.getSize())
                .category(fileCategory)
                .mimeType(file.getContentType())
                .build();

        FileMetadata saved = fileUploadRepository.save(fileUpload);

        return FileMetadataResponseDTO.builder()
                .fileId("file_" + saved.getFileId())
                .fileName(originalFileName)
                .fileUrl(saved.getFileUrl())
                .fileSize(saved.getFileSize())
                .category(saved.getCategory() != null ? saved.getCategory().name() : null)
                .uploadedAt(saved.getUploadedAt())
                .uploadedBy(currentUser.getFullName())
                .build();
    }

    private void enforceStorageQuota(User currentUser, Long incomingSize) {
        // 1. 🎯 ĐÃ SỬA: Lấy trực tiếp chuỗi String packageType từ Object liên kết, check null an toàn
        String packageType = (currentUser.getAdminPackageConfig() != null)
                ? currentUser.getAdminPackageConfig().getPackageType()
                : "FREE";
                
        // 2. Tìm cấu hình cấu trúc gói từ adminService
        AdminPackageConfig config = adminService.getPackageConfig(packageType);
        Long storageQuotaMb = config.getStorageQuotaMb();
        if (storageQuotaMb == null) {
            storageQuotaMb = getDefaultStorageQuotaMb(packageType); // Hàm bổ trợ của ông
        }

        long usedBytes = fileUploadRepository.sumFileSizeByUserId(currentUser.getUserId());
        long allowedBytes = storageQuotaMb * 1024L * 1024L;
        long totalBytes = usedBytes + (incomingSize != null ? incomingSize : 0L);
        if (totalBytes > allowedBytes) {
            throw new IllegalArgumentException(
                    "Vượt quá hạn mức lưu trữ của gói " + packageType + ". Hạn mức: " + storageQuotaMb + "MB.");
        }
    }

    private Long getDefaultStorageQuotaMb(String packageType) {
        return switch (packageType) {
            case "FREE", "BASIC" -> 100L;
            case "PROFESSIONAL" -> 1024L;
            case "ENTERPRISE" -> 5120L;
            default -> 100L;
        };
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload không được để trống");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new IllegalArgumentException("Định dạng file không hợp lệ");
        }

        String extension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Chỉ hỗ trợ file pdf, docx hoặc txt");
        }
    }

    private String buildStoredFileName(String originalFileName) {
        String safeFileName = originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        return timestamp + "_" + safeFileName;
    }

    private String resolveCurrentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Không tìm thấy thông tin đăng nhập");
        }
        if (authentication.getDetails() instanceof String details && !details.isBlank()) {
            return details;
        }
        String name = authentication.getName();
        if (name != null && !name.isBlank() && !"anonymousUser".equalsIgnoreCase(name)) {
            return name;
        }
        throw new RuntimeException("Không tìm thấy email người dùng hiện tại");
    }

    private FileMetadata.FileCategory normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return FileMetadata.FileCategory.INPUT_DIRECTIVE;
        }

        String normalized = category.trim().toUpperCase();
        return switch (normalized) {
            case "INPUT_DIRECTIVE", "DIRECTIVE" -> FileMetadata.FileCategory.INPUT_DIRECTIVE;
            case "EVIDENCE" -> FileMetadata.FileCategory.EVIDENCE;
            case "LEGAL" -> FileMetadata.FileCategory.LEGAL;
            case "CONTENT" -> FileMetadata.FileCategory.CONTENT;
            case "TEMPLATE" -> FileMetadata.FileCategory.TEMPLATE;
            case "RELATED" -> FileMetadata.FileCategory.RELATED;
            case "OUTPUT_DOCUMENT", "OUTPUT" -> FileMetadata.FileCategory.OUTPUT_DOCUMENT;
            default -> FileMetadata.FileCategory.valueOf(normalized);
        };
    }
}
