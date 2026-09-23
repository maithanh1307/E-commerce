package com.ecommerce.order_service.client;

import com.ecommerce.order_service.dto.InventoryResponseDto;
import com.ecommerce.order_service.dto.StockRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service")
public interface InventoryClient {
    @GetMapping("/api/inventory/products/{productId}")
    InventoryResponseDto getInventory(
            @PathVariable("productId") Long productId
    );

    @PostMapping(
            "/api/inventory/products/{productId}/reserve"
    )
    InventoryResponseDto reserve(
            @PathVariable("productId") Long productId,
            @RequestBody StockRequestDto request
    );

    @PostMapping(
            "/api/inventory/products/{productId}/release"
    )
    InventoryResponseDto release(
            @PathVariable("productId") Long productId,
            @RequestBody StockRequestDto request
    );
}
