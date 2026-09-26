package com.ecommerce.review_service.repository;

import com.ecommerce.review_service.entity.Review;
import com.ecommerce.review_service.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface ReviewRepository  extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndStatus(
            Long productId,
            ReviewStatus status
    );

    List<Review> findByUserId(
            Long userId
    );

    List<Review> findByOrderId(
            Long orderId
    );

    boolean existsByUserIdAndProductIdAndOrderId(
            Long userId,
            Long productId,
            Long orderId
    );

    Optional<Review> findByIdAndUserId(
            Long id,
            Long userId
    );

    List<Review> findByStatus(
            ReviewStatus status
    );
}
