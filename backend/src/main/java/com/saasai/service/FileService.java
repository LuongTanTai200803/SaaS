package com.saasai.service;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.UUID;

@Service
public class FileService {
    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    public FileUploadResponseDTO uploadFile(Long userId, MultipartFile file, String category) throws IOException {
        String fileId = UUID.randomUUID().toString();
        String fileName = fileId + "_" + file.getOriginalFilename();
        FileUpload.FileCategory fileCategory = normalizeCategory(category);

        // Create directories if not exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file to disk
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Save metadata to database
        FileUpload fileUpload = FileUpload.builder()
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .fileUrl("https://storage.trolyai.vn/inputs/" + fileName)
                .fileSize(file.getSize())
            .category(fileCategory)
                .mimeType(file.getContentType())
                .build();

        FileUpload saved = fileUploadRepository.save(fileUpload);
        User uploadedByUser = userRepository.findById(userId).orElse(null);

        return FileUploadResponseDTO.builder()
                .fileId("file_" + fileId)
                .fileName(file.getOriginalFilename())
                .fileUrl(saved.getFileUrl())
                .fileSize(saved.getFileSize())
                .category(saved.getCategory() != null ? saved.getCategory().name() : null)
            .uploadedAt(saved.getUploadedAt())
            .uploadedBy(uploadedByUser != null ? uploadedByUser.getFullName() : null)
                .build();
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
