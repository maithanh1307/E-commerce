package com.ecommerce.promotion_service.dto;

import com.ecommerce.promotion_service.entity.DiscountType;
import com.ecommerce.promotion_service.entity.PromotionStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponseDto {
    private Long id;

    private String code;

    private String description;

    private DiscountType discountType;

    private BigDecimal discountValue;

    private BigDecimal minimumOrderAmount;

    private BigDecimal maximumDiscountAmount;

    private Integer usageLimit;

    private Integer usedCount;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private PromotionStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
