package com.ecommerce.order_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponseDto {
    private Long id;
    private Long productId;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
}
