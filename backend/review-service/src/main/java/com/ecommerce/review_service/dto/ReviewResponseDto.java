package com.ecommerce.review_service.dto;

import com.ecommerce.review_service.entity.ReviewStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDto {
    private Long id;

    private Long productId;

    private Long userId;

    private Long orderId;

    private Integer rating;

    private String comment;

    private ReviewStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
