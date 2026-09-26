package com.ecommerce.review_service.controller;

import com.ecommerce.review_service.dto.CreateReviewRequestDto;
import com.ecommerce.review_service.dto.ReviewResponseDto;
import com.ecommerce.review_service.dto.UpdateReviewRequestDto;
import com.ecommerce.review_service.entity.ReviewStatus;
import com.ecommerce.review_service.service.ReviewService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // create

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponseDto createReview(
            @Valid
            @RequestBody
            CreateReviewRequestDto request) {

        return reviewService.createReview(
                request
        );
    }

    // get review by id

    @GetMapping("/{id}")
    public ReviewResponseDto getReview(
            @PathVariable Long id) {

        return reviewService.getReview(id);
    }

    // get product review

    @GetMapping("/product/{productId}")
    public List<ReviewResponseDto> getProductReviews(
            @PathVariable Long productId) {

        return reviewService.getProductReviews(
                productId
        );
    }

    // get user review

    @GetMapping("/user/{userId}")
    public List<ReviewResponseDto> getUserReviews(
            @PathVariable Long userId) {

        return reviewService.getUserReviews(
                userId
        );
    }

    // get order review

    @GetMapping("/order/{orderId}")
    public List<ReviewResponseDto> getOrderReviews(
            @PathVariable Long orderId) {

        return reviewService.getOrderReviews(
                orderId
        );
    }


    @PutMapping("/{id}/user/{userId}")
    public ReviewResponseDto updateReview(
            @PathVariable Long id,
            @PathVariable Long userId,
            @Valid
            @RequestBody
            UpdateReviewRequestDto request) {

        return reviewService.updateReview(
                id,
                userId,
                request
        );
    }

    @DeleteMapping("/{id}/user/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable Long id,
            @PathVariable Long userId) {

        reviewService.deleteReview(
                id,
                userId
        );
    }

    // update status

    @PatchMapping("/{id}/status")
    public ReviewResponseDto updateStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status) {

        return reviewService.updateStatus(
                id,
                status
        );
    }

    // get by status

    @GetMapping("/status/{status}")
    public List<ReviewResponseDto> getReviewsByStatus(
            @PathVariable ReviewStatus status) {

        return reviewService.getReviewsByStatus(
                status
        );
    }
}
