package com.ecommerce.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthDto {
    String accessToken;
    Long userId;
    String email;
    String fullName;
    String role;
}
