package com.ecommerce.promotion_service.dto;

import com.ecommerce.promotion_service.entity.DiscountType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CreatePromotionRequestDto {
    @NotBlank
    @Size(max = 50)
    private String code;

    @Size(max = 500)
    private String description;

    @NotNull
    private DiscountType discountType;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal discountValue;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal minimumOrderAmount;

    @DecimalMin(value = "0.01")
    private BigDecimal maximumDiscountAmount;

    @Min(1)
    private Integer usageLimit;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;
}
