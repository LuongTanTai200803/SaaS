package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.saasai.dto.FileUploadResponseDTO;
import com.saasai.entity.FileUpload;
import com.saasai.entity.User;
import com.saasai.repository.FileUploadRepository;
import com.saasai.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

@Service
public class FileService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "txt");

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    public FileUploadResponseDTO uploadFile(MultipartFile file, String category) throws IOException {
        User currentUser = userRepository.findByEmail(resolveCurrentEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        String storedFileName = buildStoredFileName(originalFileName);
        FileUpload.FileCategory fileCategory = normalizeCategory(category);

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(storedFileName);
        Files.write(filePath, file.getBytes());

        FileUpload fileUpload = FileUpload.builder()
                .userId(currentUser.getId())
                .fileName(originalFileName)
                .fileUrl("https://storage.trolyai.vn/inputs/" + storedFileName)
                .fileSize(file.getSize())
                .category(fileCategory)
                .mimeType(file.getContentType())
                .build();

        FileUpload saved = fileUploadRepository.save(fileUpload);

        return FileUploadResponseDTO.builder()
                .fileId("file_" + saved.getFileId())
                .fileName(originalFileName)
                .fileUrl(saved.getFileUrl())
                .fileSize(saved.getFileSize())
                .category(saved.getCategory() != null ? saved.getCategory().name() : null)
                .uploadedAt(saved.getUploadedAt())
                .uploadedBy(currentUser.getFullName())
                .build();
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

    private FileUpload.FileCategory normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return FileUpload.FileCategory.INPUT_DIRECTIVE;
        }

        String normalized = category.trim().toUpperCase();
        return switch (normalized) {
            case "INPUT_DIRECTIVE", "DIRECTIVE" -> FileUpload.FileCategory.INPUT_DIRECTIVE;
            case "EVIDENCE" -> FileUpload.FileCategory.EVIDENCE;
            case "LEGAL" -> FileUpload.FileCategory.LEGAL;
            case "CONTENT" -> FileUpload.FileCategory.CONTENT;
            case "TEMPLATE" -> FileUpload.FileCategory.TEMPLATE;
            case "RELATED" -> FileUpload.FileCategory.RELATED;
            case "OUTPUT_DOCUMENT", "OUTPUT" -> FileUpload.FileCategory.OUTPUT_DOCUMENT;
            default -> FileUpload.FileCategory.valueOf(normalized);
        };
    }
}
