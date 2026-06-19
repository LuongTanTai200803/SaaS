package com.saasai.service;

import com.saasai.dto.FileUploadResponseDTO;
import com.saasai.entity.FileUpload;
import com.saasai.entity.User;
import com.saasai.repository.FileUploadRepository;
import com.saasai.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileUploadRepository fileUploadRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FileService fileService;

    @TempDir
    Path tempDir;

    private User currentUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(fileService, "uploadDir", tempDir.toString());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(10293L, null);
        authentication.setDetails("user@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        currentUser = User.builder()
                .id(10293L)
                .email("user@example.com")
                .fullName("Nguyễn Văn A")
                .build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(currentUser));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void uploadFileShouldThrowWhenFileIsEmpty() {
        MockMultipartFile file = new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> fileService.uploadFile(file, "LEGAL"));

        assertTrue(exception.getMessage().contains("trống"));
    }

    @Test
    void uploadFileShouldThrowWhenExtensionIsInvalid() {
        MockMultipartFile file = new MockMultipartFile("file", "malware.exe", "application/octet-stream", "abc".getBytes());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> fileService.uploadFile(file, "LEGAL"));

        assertTrue(exception.getMessage().contains("pdf, docx hoặc txt"));
    }

    @Test
    void uploadFileShouldSaveMetadataAndReturnDto() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "mock-content".getBytes());

        when(fileUploadRepository.save(any(FileUpload.class))).thenAnswer(invocation -> {
            FileUpload upload = invocation.getArgument(0);
            upload.setFileId(15L);
            upload.setUploadedAt(LocalDateTime.now());
            return upload;
        });

        FileUploadResponseDTO response = fileService.uploadFile(file, "LEGAL");

        ArgumentCaptor<FileUpload> captor = ArgumentCaptor.forClass(FileUpload.class);
        verify(fileUploadRepository).save(captor.capture());
        FileUpload saved = captor.getValue();

        assertEquals(10293L, saved.getUserId());
        assertEquals("test.pdf", saved.getFileName());
        assertEquals(FileUpload.FileCategory.LEGAL, saved.getCategory());
        assertTrue(Files.list(tempDir).findAny().isPresent());
        assertEquals("file_15", response.getFileId());
        assertEquals("Nguyễn Văn A", response.getUploadedBy());
    }
}