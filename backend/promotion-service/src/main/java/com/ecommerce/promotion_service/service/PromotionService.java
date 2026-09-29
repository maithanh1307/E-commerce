package com.ecommerce.promotion_service.service;


import com.ecommerce.promotion_service.dto.*;
import com.ecommerce.promotion_service.entity.DiscountType;
import com.ecommerce.promotion_service.entity.Promotion;
import com.ecommerce.promotion_service.entity.PromotionStatus;
import com.ecommerce.promotion_service.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionCacheService promotionCacheService;

    @Transactional
    public PromotionResponseDto createPromotion(CreatePromotionRequestDto request) {

        String code = normalizeCode(request.getCode());

        if (promotionRepository.existsByCode(code)) {
            throw new RuntimeException(
                    "Promotion code already exists: " + code
            );
        }

        validateDates(
                request.getStartAt(),
                request.getEndAt()
        );

        validateDiscount(
                request.getDiscountType(),
                request.getDiscountValue()
        );

        Promotion promotion = Promotion.builder()
                .code(code)
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minimumOrderAmount(
                        request.getMinimumOrderAmount()
                )
                .maximumDiscountAmount(
                        request.getMaximumDiscountAmount()
                )
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .status(PromotionStatus.ACTIVE)
                .build();

        Promotion saved = promotionRepository.save(promotion);

        PromotionResponseDto response = toResponse(saved);

        promotionCacheService.save(response);

        return response;
    }

    @Transactional(readOnly = true)
    public PromotionResponseDto getPromotion(Long id) {

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Promotion not found: " + id
                        )
                );

        return toResponse(promotion);
    }


    @Transactional(readOnly = true)
    public List<PromotionResponseDto> getAllPromotions() {

        return promotionRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PromotionResponseDto> getActivePromotions() {

        return promotionRepository
                .findByStatusOrderByCreatedAtDesc(
                        PromotionStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PromotionResponseDto updatePromotion(Long id, UpdatePromotionRequestDto request) {

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Promotion not found: " + id
                        )
                );
        String oldCode = promotion.getCode();
        String code = normalizeCode(request.getCode());

        promotionRepository.findByCode(code)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException(
                                "Promotion code already exists: "
                                        + code
                        );
                    }
                });

        validateDates(
                request.getStartAt(),
                request.getEndAt()
        );

        validateDiscount(
                request.getDiscountType(),
                request.getDiscountValue()
        );

        promotion.setCode(code);
        promotion.setDescription(request.getDescription());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinimumOrderAmount(
                request.getMinimumOrderAmount()
        );
        promotion.setMaximumDiscountAmount(
                request.getMaximumDiscountAmount()
        );
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setStartAt(request.getStartAt());
        promotion.setEndAt(request.getEndAt());
        promotion.setStatus(request.getStatus());

        Promotion saved = promotionRepository.save(promotion);

        // delete old cache
        promotionCacheService.delete(oldCode);

        PromotionResponseDto response = toResponse(saved);

        // save new cache
        promotionCacheService.save(response);

        return response;
    }

    @Transactional
    public void deletePromotion(Long id) {

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Promotion not found: " + id
                        )
                );

        String code = promotion.getCode();

        promotionRepository.delete(promotion);

        // delete old cache
        promotionCacheService.delete(code);
    }

    @Transactional
    public PromotionResponseDto updateStatus(Long id, PromotionStatus status) {

        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Promotion not found: " + id
                        )
                );

        promotion.setStatus(status);

        Promotion saved = promotionRepository.save(promotion);

        promotionCacheService.delete(
                saved.getCode()
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PromotionValidationResponseDto validatePromotion(
            ValidatePromotionRequestDto request) {

        String code = request.getCode()
                .trim()
                .toUpperCase();

        // check redis
        PromotionResponseDto promotion =
                promotionCacheService.get(code);

        // redis miss: get from mysql
        if (promotion == null) {

            Promotion entity =
                    promotionRepository.findByCode(code)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Promotion not found: " + code
                                    )
                            );

            promotion = toResponse(entity);

            // save to redis
            promotionCacheService.save(promotion);
        }

        LocalDateTime now = LocalDateTime.now();

        // check status
        if (promotion.getStatus()
                != PromotionStatus.ACTIVE) {

            return new PromotionValidationResponseDto(
                    false,
                    code,
                    "Promotion is inactive",
                    request.getOrderAmount(),
                    BigDecimal.ZERO,
                    request.getOrderAmount()
            );
        }

        // check date
        if (now.isBefore(promotion.getStartAt())
                || now.isAfter(promotion.getEndAt())) {

            return new PromotionValidationResponseDto(
                    false,
                    code,
                    "Promotion is expired or not started",
                    request.getOrderAmount(),
                    BigDecimal.ZERO,
                    request.getOrderAmount()
            );
        }

        // check usage limit
        if (promotion.getUsageLimit() != null
                && promotion.getUsedCount()
                >= promotion.getUsageLimit()) {

            return new PromotionValidationResponseDto(
                    false,
                    code,
                    "Promotion usage limit reached",
                    request.getOrderAmount(),
                    BigDecimal.ZERO,
                    request.getOrderAmount()
            );
        }

        // check minimum order amount
        if (request.getOrderAmount()
                .compareTo(
                        promotion.getMinimumOrderAmount()
                ) < 0) {

            return new PromotionValidationResponseDto(
                    false,
                    code,
                    "Order amount does not meet minimum requirement",
                    request.getOrderAmount(),
                    BigDecimal.ZERO,
                    request.getOrderAmount()
            );
        }

        // cal discount
        BigDecimal discountAmount;

        if (promotion.getDiscountType()
                == DiscountType.PERCENTAGE) {

            discountAmount =
                    request.getOrderAmount()
                            .multiply(
                                    promotion.getDiscountValue()
                            )
                            .divide(
                                    BigDecimal.valueOf(100),
                                    2,
                                    RoundingMode.HALF_UP
                            );

            // maximum discount
            if (promotion.getMaximumDiscountAmount()
                    != null
                    && discountAmount.compareTo(
                    promotion.getMaximumDiscountAmount()
            ) > 0) {

                discountAmount =
                        promotion.getMaximumDiscountAmount();
            }

        } else {

            discountAmount =
                    promotion.getDiscountValue();
        }


        //discount cannot exceed order amount

        if (discountAmount.compareTo(
                request.getOrderAmount()
        ) > 0) {

            discountAmount =
                    request.getOrderAmount();
        }

        // cal final
        BigDecimal finalAmount =
                request.getOrderAmount()
                        .subtract(discountAmount)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        return new PromotionValidationResponseDto(
                true,
                code,
                "Promotion is valid",
                request.getOrderAmount(),
                discountAmount,
                finalAmount
        );
    }

    private BigDecimal calculateDiscount(Promotion promotion, BigDecimal orderAmount) {

        BigDecimal discount;

        if (promotion.getDiscountType()
                == DiscountType.PERCENTAGE) {

            discount = orderAmount
                    .multiply(
                            promotion.getDiscountValue()
                    )
                    .divide(
                            BigDecimal.valueOf(100),
                            2,
                            RoundingMode.HALF_UP
                    );

            if (promotion.getMaximumDiscountAmount()
                    != null
                    && discount.compareTo(
                    promotion.getMaximumDiscountAmount()
            ) > 0) {

                discount =
                        promotion.getMaximumDiscountAmount();
            }

        } else {

            discount = promotion.getDiscountValue();
        }

        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    private void validateDates(LocalDateTime startAt, LocalDateTime endAt) {

        if (!endAt.isAfter(startAt)) {
            throw new RuntimeException(
                    "End date must be after start date"
            );
        }
    }

    private void validateDiscount(DiscountType type, BigDecimal value) {

        if (type == DiscountType.PERCENTAGE
                && value.compareTo(
                BigDecimal.valueOf(100)
        ) > 0) {

            throw new RuntimeException(
                    "Percentage discount cannot exceed 100%"
            );
        }
    }

    private String normalizeCode(String code) {

        return code.trim().toUpperCase();
    }

    private PromotionResponseDto toResponse(Promotion promotion) {

        return PromotionResponseDto.builder()
                .id(promotion.getId())
                .code(promotion.getCode())
                .description(promotion.getDescription())
                .discountType(promotion.getDiscountType())
                .discountValue(promotion.getDiscountValue())
                .minimumOrderAmount(
                        promotion.getMinimumOrderAmount()
                )
                .maximumDiscountAmount(
                        promotion.getMaximumDiscountAmount()
                )
                .usageLimit(promotion.getUsageLimit())
                .usedCount(promotion.getUsedCount())
                .startAt(promotion.getStartAt())
                .endAt(promotion.getEndAt())
                .status(promotion.getStatus())
                .createdAt(promotion.getCreatedAt())
                .updatedAt(promotion.getUpdatedAt())
                .build();
    }
}
