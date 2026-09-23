package com.ecommerce.inventory_service.dto;

import com.ecommerce.inventory_service.entity.StockMovementType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementResponseDto {
    private Long id;

    private Long productId;

    private StockMovementType type;

    private Integer quantity;

    private String reason;

    private LocalDateTime createdAt;

}
