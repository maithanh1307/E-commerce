package com.ecommerce.promotion_service.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResponseDto {
    private boolean valid;

    private String code;

    private String message;

    private BigDecimal orderAmount;

    private BigDecimal discountAmount;

    private BigDecimal finalAmount;
}
