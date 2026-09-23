package com.ecommerce.inventory_service.controller;

import com.ecommerce.inventory_service.dto.InventoryRequestDto;
import com.ecommerce.inventory_service.dto.InventoryResponseDto;
import com.ecommerce.inventory_service.dto.StockMovementResponseDto;
import com.ecommerce.inventory_service.dto.StockRequestDto;
import com.ecommerce.inventory_service.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryResponseDto createInventory(
            @Valid @RequestBody InventoryRequestDto request) {

        return inventoryService.createInventory(request);
    }

    @GetMapping("/products/{productId}")
    public InventoryResponseDto getInventory(
            @PathVariable Long productId) {

        return inventoryService
                .getInventoryByProductId(productId);
    }

    @PostMapping("/products/{productId}/stock-in")
    public InventoryResponseDto stockIn(
            @PathVariable Long productId,
            @Valid @RequestBody StockRequestDto request) {

        return inventoryService.stockIn(
                productId,
                request
        );
    }

    @PostMapping("/products/{productId}/stock-out")
    public InventoryResponseDto stockOut(
            @PathVariable Long productId,
            @Valid @RequestBody StockRequestDto request) {

        return inventoryService.stockOut(
                productId,
                request
        );
    }

    @PostMapping("/products/{productId}/reserve")
    public InventoryResponseDto reserve(
            @PathVariable Long productId,
            @Valid @RequestBody StockRequestDto request) {

        return inventoryService.reserve(
                productId,
                request
        );
    }

    @PostMapping("/products/{productId}/release")
    public InventoryResponseDto release(
            @PathVariable Long productId,
            @Valid @RequestBody StockRequestDto request) {

        return inventoryService.release(
                productId,
                request
        );
    }

    @GetMapping("/products/{productId}/movements")
    public List<StockMovementResponseDto> getMovements(
            @PathVariable Long productId) {

        return inventoryService
                .getMovements(productId);
    }
}
