package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.dto.FileUploadResponseDTO;
import com.saasai.service.FileService;

@RestController
@RequestMapping("/api/v1/files")
@CrossOrigin(origins = "*")
public class FileController {
    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponseDTO<FileUploadResponseDTO>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category) throws java.io.IOException {
        FileUploadResponseDTO response = fileService.uploadFile(file, category);
        return ResponseEntity.ok(ApiResponseDTO.success("Tải file thành công", response));
    }
}
