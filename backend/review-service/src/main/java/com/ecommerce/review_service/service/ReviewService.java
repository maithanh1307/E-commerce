package com.ecommerce.review_service.service;

import com.ecommerce.review_service.client.OrderClient;
import com.ecommerce.review_service.dto.CreateReviewRequestDto;
import com.ecommerce.review_service.dto.ReviewResponseDto;
import com.ecommerce.review_service.dto.UpdateReviewRequestDto;
import com.ecommerce.review_service.dto.order.OrderResponseDto;
import com.ecommerce.review_service.entity.Review;
import com.ecommerce.review_service.entity.ReviewStatus;
import com.ecommerce.review_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    private final OrderClient orderClient;


    @Transactional
    public ReviewResponseDto createReview(
            CreateReviewRequestDto request) {

        // check duplicate review

        boolean exists =
                reviewRepository
                        .existsByUserIdAndProductIdAndOrderId(
                                request.getUserId(),
                                request.getProductId(),
                                request.getOrderId()
                        );

        if (exists) {

            throw new RuntimeException(
                    "You have already reviewed this product for this order"
            );
        }

        // get order

        OrderResponseDto order =
                orderClient.getOrder(
                        request.getUserId(),
                        request.getOrderId()
                );

        if (order == null) {

            throw new RuntimeException(
                    "Order not found"
            );
        }

        // check order owner

        if (!request.getUserId()
                .equals(order.getUserId())) {

            throw new RuntimeException(
                    "You are not the owner of this order"
            );
        }

        // check order status

        if (!"PAID".equals(
                order.getStatus())) {

            throw new RuntimeException(
                    "Only paid orders can be reviewed"
            );
        }

        // check product exist in order

        boolean productExists =
                order.getItems()
                        .stream()
                        .anyMatch(
                                item ->
                                        request
                                                .getProductId()
                                                .equals(
                                                        item.getProductId()
                                                )
                        );

        if (!productExists) {

            throw new RuntimeException(
                    "Product was not found in this order"
            );
        }

        // create review

        Review review =
                Review.builder()
                        .productId(
                                request.getProductId()
                        )
                        .userId(
                                request.getUserId()
                        )
                        .orderId(
                                request.getOrderId()
                        )
                        .rating(
                                request.getRating()
                        )
                        .comment(
                                request.getComment()
                        )
                        .status(
                                ReviewStatus.PENDING
                        )
                        .build();

        Review savedReview =
                reviewRepository.save(review);

        return toResponse(savedReview);
    }

    // get review by id

    public ReviewResponseDto getReview(
            Long id) {

        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review not found"
                                )
                        );

        return toResponse(review);
    }

    // get approve review by product

    public List<ReviewResponseDto> getProductReviews(
            Long productId) {

        return reviewRepository
                .findByProductIdAndStatus(
                        productId,
                        ReviewStatus.APPROVED
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // get user review

    public List<ReviewResponseDto> getUserReviews(
            Long userId) {

        return reviewRepository
                .findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // get order review

    public List<ReviewResponseDto> getOrderReviews(
            Long orderId) {

        return reviewRepository
                .findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // update review

    @Transactional
    public ReviewResponseDto updateReview(
            Long id,
            Long userId,
            UpdateReviewRequestDto request) {

        Review review =
                reviewRepository
                        .findByIdAndUserId(
                                id,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review not found"
                                )
                        );

        review.setRating(
                request.getRating()
        );

        review.setComment(
                request.getComment()
        );

        // Edited review needs to be reviewed again
        review.setStatus(
                ReviewStatus.PENDING
        );

        Review updatedReview =
                reviewRepository.save(review);

        return toResponse(updatedReview);
    }

    // delete review

    @Transactional
    public void deleteReview(
            Long id,
            Long userId) {

        Review review =
                reviewRepository
                        .findByIdAndUserId(
                                id,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review not found"
                                )
                        );

        reviewRepository.delete(review);
    }

    // update status

    @Transactional
    public ReviewResponseDto updateStatus(
            Long id,
            ReviewStatus status) {

        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review not found"
                                )
                        );

        review.setStatus(status);

        Review updatedReview =
                reviewRepository.save(review);

        return toResponse(updatedReview);
    }

    // get review by status

    public List<ReviewResponseDto> getReviewsByStatus(
            ReviewStatus status) {

        return reviewRepository
                .findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // mapping

    private ReviewResponseDto toResponse(
            Review review) {

        return ReviewResponseDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .orderId(review.getOrderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
