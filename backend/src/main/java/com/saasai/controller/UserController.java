package com.saasai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.saasai.dto.DocumentDTO;
import com.saasai.dto.PaginatedResponseDTO;
import com.saasai.dto.UserProfileDTO;
import com.saasai.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object details = authentication != null ? authentication.getDetails() : null;
        String email = details instanceof String ? (String) details : null;

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileDTO profile = userService.getUserProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/documents")
    public ResponseEntity<PaginatedResponseDTO<DocumentDTO>> getRecentDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getDetails();
        PaginatedResponseDTO<DocumentDTO> documents = userService.getUserDocumentsByUserEmail(email, page, size);
        return ResponseEntity.ok(documents);
    }
}
