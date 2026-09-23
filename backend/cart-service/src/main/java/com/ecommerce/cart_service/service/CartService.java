package com.ecommerce.cart_service.service;

import com.ecommerce.cart_service.dto.AddCartItemRequestDto;
import com.ecommerce.cart_service.dto.CartItemResponseDto;
import com.ecommerce.cart_service.dto.CartResponseDto;
import com.ecommerce.cart_service.dto.UpdateCartItemRequestDto;
import com.ecommerce.cart_service.entity.Cart;
import com.ecommerce.cart_service.entity.CartItem;
import com.ecommerce.cart_service.repository.CartItemRepository;
import com.ecommerce.cart_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    @Transactional
    public CartResponseDto createCart(Long userId) {

        if (cartRepository.existsByUserId(userId)) {

            throw new RuntimeException(
                    "Cart already exists for user "
                            + userId
            );
        }

        Cart cart = Cart.builder()
                .userId(userId)
                .build();

        cart = cartRepository.save(cart);

        return toResponse(cart);
    }

    @Transactional(readOnly = true)
    public CartResponseDto getCart(Long userId) {

        Cart cart = getCartEntity(userId);

        return toResponse(cart);
    }

    @Transactional
    public CartResponseDto addItem(Long userId, AddCartItemRequestDto request) {

        Cart cart = getCartEntity(userId);

        CartItem item =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                request.getProductId()
                        )
                        .orElse(null);

        if (item != null) {

            item.setQuantity(
                    item.getQuantity()
                            + request.getQuantity()
            );

        } else {

            item = CartItem.builder()
                    .cart(cart)
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .build();

            cart.getItems().add(item);
        }

        cartItemRepository.save(item);

        return toResponse(cart);
    }

    @Transactional
    public CartResponseDto updateItem(Long userId, Long productId, UpdateCartItemRequestDto request) {

        Cart cart = getCartEntity(userId);

        CartItem item =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product "
                                                + productId
                                                + " not found in cart"
                                )
                        );

        item.setQuantity(request.getQuantity());

        cartItemRepository.save(item);

        return toResponse(cart);
    }

    @Transactional
    public CartResponseDto removeItem(Long userId, Long productId) {

        Cart cart = getCartEntity(userId);

        CartItem item =
                cartItemRepository
                        .findByCartIdAndProductId(
                                cart.getId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product "
                                                + productId
                                                + " not found in cart"
                                )
                        );

        cart.getItems().remove(item);

        cartItemRepository.delete(item);

        return toResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {

        Cart cart = getCartEntity(userId);

        cartItemRepository.deleteByCartId(
                cart.getId()
        );

        cart.getItems().clear();
    }

    private Cart getCartEntity(Long userId) {

        return cartRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart not found for user "
                                        + userId
                        )
                );
    }


    private CartResponseDto toResponse(Cart cart) {

        return CartResponseDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(
                        cart.getItems()
                                .stream()
                                .map(this::toItemResponse)
                                .toList()
                )
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }


    private CartItemResponseDto toItemResponse(CartItem item) {

        return CartItemResponseDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .quantity(item.getQuantity())
                .build();
    }
}
