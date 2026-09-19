package com.ecommerce.auth_service.controller;

import com.ecommerce.auth_service.dto.AuthDto;
import com.ecommerce.auth_service.dto.LoginDto;
import com.ecommerce.auth_service.dto.RegisterDto;
import com.ecommerce.auth_service.dto.UserDto;
import com.ecommerce.auth_service.service.AuthService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthDto> register(
            @Valid
            @RequestBody
            RegisterDto request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto> login(
            @Valid
            @RequestBody
            LoginDto request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                authService.getCurrentUser(
                        authentication.getName()
                )
        );
    }
}
