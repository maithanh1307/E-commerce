package com.ecommerce.product_service.dto;

import com.ecommerce.product_service.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponseDto {
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String category;

    private Integer stockQuantity;

    private ProductStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
