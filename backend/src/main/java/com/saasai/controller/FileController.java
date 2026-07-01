package com.saasai.controller;

import com.saasai.dto.FileMetadataResponseDTO;
import com.saasai.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/files") // Hoặc endpoint cha tùy cấu hình urls.ts của ông
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileMetadataResponseDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        
        // Gọi thẳng Service xử lý lưu cục bộ và lưu DB mà ông đã viết
        FileMetadataResponseDTO response = fileService.uploadFile(file, category);
        
        return ResponseEntity.ok(response);
    }
}