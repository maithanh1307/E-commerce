package com.ecommerce.order_service.service;

import com.ecommerce.order_service.client.CartClient;
import com.ecommerce.order_service.client.InventoryClient;
import com.ecommerce.order_service.client.ProductClient;
import com.ecommerce.order_service.client.PromotionClient;
import com.ecommerce.order_service.dto.*;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderItem;
import com.ecommerce.order_service.entity.OrderStatus;
import com.ecommerce.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    private final CartClient cartClient;

    private final ProductClient productClient;

    private final InventoryClient inventoryClient;

    private final PromotionClient promotionClient;

    @Transactional
//    public OrderResponseDto createOrder(Long userId, CreateOrderRequestDto request) {
//
//        CartResponseDto cart =
//                cartClient.getCart(userId);
//
//        if (cart == null
//                || cart.getItems() == null
//                || cart.getItems().isEmpty()) {
//
//            throw new RuntimeException(
//                    "Cart is empty"
//            );
//        }
//
//        List<Long> reservedProducts =
//                new ArrayList<>();
//
//        try {
//
//            Order order = Order.builder()
//                    .userId(userId)
//                    .status(OrderStatus.PENDING_PAYMENT)
//                    .totalAmount(BigDecimal.ZERO)
//                    .build();
//
//            BigDecimal total = BigDecimal.ZERO;
//
//            for (CartItemResponseDto cartItem
//                    : cart.getItems()) {
//
//                ProductResponseDto product =
//                        productClient.getProduct(
//                                cartItem.getProductId()
//                        );
//
//                if (product == null) {
//
//                    throw new RuntimeException(
//                            "Product not found: "
//                                    + cartItem.getProductId()
//                    );
//                }
//
//                if (!"ACTIVE".equals(
//                        product.getStatus())) {
//
//                    throw new RuntimeException(
//                            "Product is inactive: "
//                                    + product.getId()
//                    );
//                }
//
//                BigDecimal subtotal =
//                        product.getPrice()
//                                .multiply(
//                                        BigDecimal.valueOf(
//                                                cartItem.getQuantity()
//                                        )
//                                );
//
//                OrderItem orderItem =
//                        OrderItem.builder()
//                                .order(order)
//                                .productId(product.getId())
//                                .productName(product.getName())
//                                .unitPrice(product.getPrice())
//                                .quantity(cartItem.getQuantity())
//                                .subtotal(subtotal)
//                                .build();
//
//                order.getItems().add(orderItem);
//
//                total = total.add(subtotal);
//
//                // reserve stock
//                StockRequestDto stockRequest =
//                        new StockRequestDto(
//                                cartItem.getQuantity(),
//                                "Order checkout"
//                        );
//
//                inventoryClient.reserve(
//                        product.getId(),
//                        stockRequest
//                );
//
//                reservedProducts.add(
//                        product.getId()
//                );
//            }
//
//            order.setTotalAmount(total);
//
//            Order savedOrder =
//                    orderRepository.save(order);
//
//            // clear cart only after order is saved
//            cartClient.clearCart(userId);
//
//            return toResponse(savedOrder);
//
//        } catch (Exception exception) {
//
//            // release all stock already reserved
//            releaseReservedStock(
//                    cart,
//                    reservedProducts
//            );
//
//            throw exception;
//        }
//    }

    public OrderResponseDto createOrder(
            Long userId,
            CreateOrderRequestDto request) {

        CartResponseDto cart =
                cartClient.getCart(userId);

        if (cart == null
                || cart.getItems() == null
                || cart.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        List<Long> reservedProducts =
                new ArrayList<>();

        try {

            Order order = Order.builder()
                    .userId(userId)
                    .status(OrderStatus.PENDING_PAYMENT)
                    .subtotal(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .promotionCode(null)
                    .totalAmount(BigDecimal.ZERO)
                    .build();

            BigDecimal subtotal =
                    BigDecimal.ZERO;

            for (CartItemResponseDto cartItem
                    : cart.getItems()) {

                ProductResponseDto product =
                        productClient.getProduct(
                                cartItem.getProductId()
                        );

                if (product == null) {

                    throw new RuntimeException(
                            "Product not found: "
                                    + cartItem.getProductId()
                    );
                }

                if (!"ACTIVE".equals(
                        product.getStatus())) {

                    throw new RuntimeException(
                            "Product is inactive: "
                                    + product.getId()
                    );
                }

                BigDecimal itemSubtotal =
                        product.getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                cartItem.getQuantity()
                                        )
                                );

                OrderItem orderItem =
                        OrderItem.builder()
                                .order(order)
                                .productId(product.getId())
                                .productName(product.getName())
                                .unitPrice(product.getPrice())
                                .quantity(cartItem.getQuantity())
                                .subtotal(itemSubtotal)
                                .build();

                order.getItems().add(orderItem);

                subtotal =
                        subtotal.add(itemSubtotal);
            }

            order.setSubtotal(subtotal);

            BigDecimal discountAmount =
                    BigDecimal.ZERO;

            BigDecimal totalAmount =
                    subtotal;

            String promotionCode = null;

            if (request != null
                    && request.getPromotionCode() != null
                    && !request.getPromotionCode()
                    .trim()
                    .isEmpty()) {

                PromotionValidationRequestDto promotionRequest =
                        new PromotionValidationRequestDto(
                                request.getPromotionCode()
                                        .trim(),
                                userId,
                                subtotal
                        );

                PromotionValidationResponseDto promotion =
                        promotionClient.validatePromotion(
                                promotionRequest
                        );

                if (promotion == null) {

                    throw new RuntimeException(
                            "Unable to validate promotion"
                    );
                }

                if (!promotion.isValid()) {

                    throw new RuntimeException(
                            promotion.getMessage()
                    );
                }

                discountAmount =
                        promotion.getDiscountAmount();

                totalAmount =
                        promotion.getFinalAmount();

                promotionCode =
                        promotion.getCode();
            }

            order.setDiscountAmount(
                    discountAmount
            );

            order.setPromotionCode(
                    promotionCode
            );

            order.setTotalAmount(
                    totalAmount
            );

            for (CartItemResponseDto cartItem
                    : cart.getItems()) {

                StockRequestDto stockRequest =
                        new StockRequestDto(
                                cartItem.getQuantity(),
                                "Order checkout"
                        );

                inventoryClient.reserve(
                        cartItem.getProductId(),
                        stockRequest
                );

                reservedProducts.add(
                        cartItem.getProductId()
                );
            }

            Order savedOrder =
                    orderRepository.save(order);

            cartClient.clearCart(userId);

            return toResponse(savedOrder);

        } catch (Exception exception) {

            releaseReservedStock(
                    cart,
                    reservedProducts
            );

            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrder(Long userId, Long orderId) {

        Order order =
                orderRepository
                        .findByIdAndUserId(
                                orderId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getUserOrders(Long userId) {

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponseDto cancelOrder(Long userId, Long orderId) {

        Order order =
                orderRepository
                        .findByIdAndUserId(
                                orderId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );

        if (order.getStatus()
                == OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled"
            );
        }

        if (order.getStatus()
                == OrderStatus.PAID) {

            throw new RuntimeException(
                    "Paid order cannot be cancelled "
                            + "using this endpoint"
            );
        }

        // release inventory
        for (OrderItem item
                : order.getItems()) {

            StockRequestDto request =
                    new StockRequestDto(
                            item.getQuantity(),
                            "Order cancelled"
                    );

            inventoryClient.release(
                    item.getProductId(),
                    request
            );
        }

        order.setStatus(
                OrderStatus.CANCELLED
        );

        orderRepository.save(order);

        return toResponse(order);
    }

    @Transactional
    public OrderResponseDto markAsPaid(Long userId, Long orderId) {

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found"
                        )
                );

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order cannot be paid"
            );
        }

        if (order.getStatus() == OrderStatus.PAID) {
            return toResponse(order);
        }

        order.setStatus(OrderStatus.PAID);

        Order savedOrder = orderRepository.save(order);

        return toResponse(savedOrder);
    }

    private void releaseReservedStock(CartResponseDto cart, List<Long> reservedProducts) {

        if (cart == null
                || cart.getItems() == null) {
            return;
        }

        for (CartItemResponseDto item
                : cart.getItems()) {

            if (!reservedProducts.contains(
                    item.getProductId())) {
                continue;
            }

            try {

                StockRequestDto request =
                        new StockRequestDto(
                                item.getQuantity(),
                                "Order creation failed"
                        );

                inventoryClient.release(
                        item.getProductId(),
                        request
                );

            } catch (Exception ignored) {

            }
        }
    }

    private OrderResponseDto toResponse(Order order) {

        return OrderResponseDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus())
                .totalAmount(
                        order.getTotalAmount()
                )
                .items(
                        order.getItems()
                                .stream()
                                .map(
                                        this::toItemResponse
                                )
                                .toList()
                )
                .createdAt(
                        order.getCreatedAt()
                )
                .updatedAt(
                        order.getUpdatedAt()
                )
                .build();
    }


    private OrderItemResponseDto toItemResponse(OrderItem item) {

        return OrderItemResponseDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(
                        item.getProductName()
                )
                .unitPrice(
                        item.getUnitPrice()
                )
                .quantity(
                        item.getQuantity()
                )
                .subtotal(
                        item.getSubtotal()
                )
                .build();
    }
}
