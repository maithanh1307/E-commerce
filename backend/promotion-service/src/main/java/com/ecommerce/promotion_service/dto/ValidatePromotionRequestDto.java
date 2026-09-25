package com.ecommerce.promotion_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValidatePromotionRequestDto {
    @NotBlank
    private String code;

    @NotNull
    private Long userId;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal orderAmount;
}
