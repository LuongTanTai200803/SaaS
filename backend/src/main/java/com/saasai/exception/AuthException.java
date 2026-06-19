package com.saasai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // Or HttpStatus.UNAUTHORIZED for login failures
public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}