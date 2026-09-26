package com.ecommerce.review_service.dto.order;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;

    private Long userId;

    private String status;

    private BigDecimal subtotal;

    private BigDecimal discountAmount;

    private String promotionCode;

    private BigDecimal totalAmount;

    private List<OrderItemResponseDto> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
