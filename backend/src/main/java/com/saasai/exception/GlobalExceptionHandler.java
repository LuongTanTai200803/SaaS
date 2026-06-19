package com.saasai.exception;

import com.saasai.dto.ApiResponseDTO;
import com.saasai.exception.TooManyRequestsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleAuthException(AuthException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.UNAUTHORIZED.value())
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.FORBIDDEN.value())
                        .build());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.BAD_REQUEST.value())
                        .build());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .build());
    }

    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleTooManyRequestsException(TooManyRequestsException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .statusCode(HttpStatus.TOO_MANY_REQUESTS.value())
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDTO.builder()
                        .success(false)
                        .message("Internal server error")
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build());
    }
}
