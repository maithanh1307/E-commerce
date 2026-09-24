package com.ecommerce.payment_service.controller;

import com.ecommerce.payment_service.dto.CreatePaymentRequestDto;
import com.ecommerce.payment_service.dto.PaymentResponseDto;
import com.ecommerce.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponseDto createPayment(
            @Valid @RequestBody CreatePaymentRequestDto request) {

        return paymentService.createPayment(request);
    }

    @GetMapping("/{id}")
    public PaymentResponseDto getPayment(
            @PathVariable Long id) {

        return paymentService.getPayment(id);
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponseDto getPaymentByOrder(
            @PathVariable Long orderId) {

        return paymentService.getPaymentByOrder(
                orderId
        );
    }

    @GetMapping("/user/{userId}")
    public List<PaymentResponseDto> getUserPayments(
            @PathVariable Long userId) {

        return paymentService.getUserPayments(
                userId
        );
    }

    @PutMapping("/{id}/confirm")
    public PaymentResponseDto confirmPayment(
            @PathVariable Long id) {

        return paymentService.confirmPayment(id);
    }

    @PutMapping("/{id}/fail")
    public PaymentResponseDto failPayment(
            @PathVariable Long id,
            @RequestParam(
                    defaultValue = "Payment failed"
            )
            String reason) {

        return paymentService.failPayment(
                id,
                reason
        );
    }
}
