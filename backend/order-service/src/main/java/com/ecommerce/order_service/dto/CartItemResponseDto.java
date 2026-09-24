package com.ecommerce.order_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDto {
    private Long id;
    private Long productId;
    private Integer quantity;
}
