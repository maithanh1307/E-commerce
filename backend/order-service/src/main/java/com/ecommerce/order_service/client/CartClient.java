package com.ecommerce.order_service.client;

import com.ecommerce.order_service.dto.CartResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "cart-service")
public interface CartClient {
    @GetMapping("/api/cart/{userId}")
    CartResponseDto getCart(
            @PathVariable("userId") Long userId
    );

    @DeleteMapping("/api/cart/{userId}")
    void clearCart(
            @PathVariable("userId") Long userId
    );
}
