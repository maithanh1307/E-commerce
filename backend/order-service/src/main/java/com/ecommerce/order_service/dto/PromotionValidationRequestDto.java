package com.ecommerce.order_service.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationRequestDto {
    private String code;
    private Long userId;
    private BigDecimal orderAmount;
}
