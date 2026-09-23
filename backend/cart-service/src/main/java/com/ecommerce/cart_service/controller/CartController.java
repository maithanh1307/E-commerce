package com.ecommerce.cart_service.controller;

import com.ecommerce.cart_service.dto.AddCartItemRequestDto;
import com.ecommerce.cart_service.dto.CartResponseDto;
import com.ecommerce.cart_service.dto.UpdateCartItemRequestDto;
import com.ecommerce.cart_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;


    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponseDto createCart(@PathVariable Long userId) {

        return cartService.createCart(userId);
    }

    @GetMapping("/{userId}")
    public CartResponseDto getCart(@PathVariable Long userId) {

        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}/items")
    public CartResponseDto addItem(@PathVariable Long userId, @Valid @RequestBody AddCartItemRequestDto request) {

        return cartService.addItem(
                userId,
                request
        );
    }

    @PutMapping("/{userId}/items/{productId}")
    public CartResponseDto updateItem(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequestDto request) {

        return cartService.updateItem(
                userId,
                productId,
                request
        );
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public CartResponseDto removeItem(@PathVariable Long userId, @PathVariable Long productId) {

        return cartService.removeItem(
                userId,
                productId
        );
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@PathVariable Long userId) {

        cartService.clearCart(userId);
    }
}
