package com.ecommerce.promotion_service.controller;

import com.ecommerce.promotion_service.dto.*;
import com.ecommerce.promotion_service.entity.PromotionStatus;
import com.ecommerce.promotion_service.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @PostMapping
    public ResponseEntity<PromotionResponseDto> createPromotion(@Valid @RequestBody CreatePromotionRequestDto request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        promotionService.createPromotion(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<PromotionResponseDto>>getAllPromotions() {

        return ResponseEntity.ok(
                promotionService.getAllPromotions()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponseDto>>getActivePromotions() {

        return ResponseEntity.ok(
                promotionService.getActivePromotions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponseDto>getPromotion(@PathVariable Long id) {

        return ResponseEntity.ok(
                promotionService.getPromotion(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponseDto>updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePromotionRequestDto request) {

        return ResponseEntity.ok(
                promotionService.updatePromotion(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>deletePromotion(@PathVariable Long id) {

        promotionService.deletePromotion(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PromotionResponseDto>updateStatus(@PathVariable Long id, @RequestParam PromotionStatus status) {

        return ResponseEntity.ok(
                promotionService.updateStatus(
                        id,
                        status
                )
        );
    }

    @PostMapping("/validate")
    public ResponseEntity<PromotionValidationResponseDto>validatePromotion(@Valid @RequestBody ValidatePromotionRequestDto request) {

        return ResponseEntity.ok(
                promotionService.validatePromotion(request)
        );
    }
}
