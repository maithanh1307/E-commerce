package com.ecommerce.order_service.client;

import com.ecommerce.order_service.dto.ProductResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-service")
public interface ProductClient {
    @GetMapping("/api/products/{id}")
    ProductResponseDto getProduct(
            @PathVariable("id") Long id
    );
}
