package com.ecommerce.payment_service.dto;

import com.ecommerce.payment_service.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;

    private Long userId;

    private OrderStatus status;

    private BigDecimal totalAmount;
}
