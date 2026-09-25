package com.ecommerce.order_service.client;

import com.ecommerce.order_service.dto.PromotionValidationRequestDto;
import com.ecommerce.order_service.dto.PromotionValidationResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "promotion-service")
public interface PromotionClient {
    @PostMapping("/api/promotions/validate")
    PromotionValidationResponseDto validatePromotion(
            @RequestBody PromotionValidationRequestDto request
    );
}
