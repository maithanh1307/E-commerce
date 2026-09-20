package com.ecommerce.auth_service.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserDto {
    Long id;
    String email;
    String fullName;
    String role;
}
