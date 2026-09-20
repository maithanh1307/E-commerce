package com.ecommerce.auth_service.service;
import com.ecommerce.auth_service.dto.AuthDto;
import com.ecommerce.auth_service.dto.LoginDto;
import com.ecommerce.auth_service.dto.RegisterDto;
import com.ecommerce.auth_service.dto.UserDto;
import com.ecommerce.auth_service.entity.Role;
import com.ecommerce.auth_service.entity.User;
import com.ecommerce.auth_service.repository.UserRepository;
import com.ecommerce.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthDto register(RegisterDto request) {
        if (
                userRepository
                        .existsByEmail(request.getEmail())
        ) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .fullName(request.getFullName())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String accessToken =
                jwtService.generateAccessToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        return new AuthDto(
                accessToken,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    public AuthDto login(LoginDto request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );

        if (!user.isEnabled()) {

            throw new RuntimeException(
                    "User account is disabled"
            );
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtService.generateAccessToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        return new AuthDto(
                accessToken,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    public UserDto getCurrentUser(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
