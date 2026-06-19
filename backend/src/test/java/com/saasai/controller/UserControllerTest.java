package com.saasai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saasai.dto.DocumentDTO;
import com.saasai.dto.PaginatedResponseDTO;
import com.saasai.dto.UserProfileDTO;
import com.saasai.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private static final Long USER_ID = 10293L;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(USER_ID, null);
        authentication.setDetails("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getProfileShouldReturnUserProfile() throws Exception {
        UserProfileDTO profile = UserProfileDTO.builder()
                .id(USER_ID)
                .email("test@example.com")
                .fullName("Nguyễn Văn A")
                .role("ROLE_USER")
                .creditBalance(350.0)
                .build();

        // Mock the correct method call in UserService
        when(userService.getUserProfileByEmail("test@example.com")).thenReturn(profile);

        mockMvc.perform(get("/api/v1/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10293))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.fullName").value("Nguyễn Văn A"));
    }

    @Test
    void getDocumentsShouldReturnPaginatedDocuments() throws Exception {
        DocumentDTO doc = DocumentDTO.builder()
                .sessionId(501L)
                .sessionName("Báo cáo tổng kết")
                .tagId("Văn kiện Đảng")
                .updatedAt(LocalDateTime.now())
                .status("Hoàn thành")
                .build();

        PaginatedResponseDTO<DocumentDTO> response = PaginatedResponseDTO.<DocumentDTO>builder()
                .content(List.of(doc))
                .totalPages(1)
                .totalElements(1L)
                .currentPage(0)
                .pageSize(10)
                .build();

        when(userService.getUserDocumentsByUserEmail("test@example.com", 0, 10)).thenReturn(response);

        mockMvc.perform(get("/api/v1/users/documents")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sessionId").value(501))
                .andExpect(jsonPath("$.content[0].status").value("Hoàn thành"))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.totalElements").value(1));
    }
}
