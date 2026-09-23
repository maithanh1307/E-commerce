package com.ecommerce.cart_service.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    private Long id;

    private Long userId;

    private List<CartItemResponseDto> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
