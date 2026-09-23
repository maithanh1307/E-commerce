package com.ecommerce.order_service.controller;

import com.ecommerce.order_service.dto.OrderResponseDto;
import com.ecommerce.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponseDto createOrder(@PathVariable Long userId) {

        return orderService.createOrder(
                userId
        );
    }

    @GetMapping("/user/{userId}")
    public List<OrderResponseDto> getUserOrders(@PathVariable Long userId) {

        return orderService.getUserOrders(
                userId
        );
    }

    @GetMapping("/{userId}/{orderId}")
    public OrderResponseDto getOrder(@PathVariable Long userId, @PathVariable Long orderId) {

        return orderService.getOrder(
                userId,
                orderId
        );
    }

    @PutMapping("/{userId}/{orderId}/cancel")
    public OrderResponseDto cancelOrder(@PathVariable Long userId, @PathVariable Long orderId) {

        return orderService.cancelOrder(
                userId,
                orderId
        );
    }
}
