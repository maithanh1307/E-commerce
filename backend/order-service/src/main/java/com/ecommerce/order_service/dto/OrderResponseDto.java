package com.ecommerce.order_service.dto;

import com.ecommerce.order_service.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private Long userId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private List<OrderItemResponseDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
