package com.ecommerce.review_service.client;

import com.ecommerce.review_service.dto.order.OrderResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "order-service")
public interface OrderClient {
    @GetMapping(
            "/api/orders/{userId}/{orderId}"
    )
    OrderResponseDto getOrder(
            @PathVariable("userId")
            Long userId,

            @PathVariable("orderId")
            Long orderId
    );
}
