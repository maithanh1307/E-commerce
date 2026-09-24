package com.ecommerce.payment_service.dto;

import com.ecommerce.payment_service.entity.PaymentMethod;
import com.ecommerce.payment_service.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;

    private Long orderId;

    private Long userId;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus status;

    private String transactionId;

    private String failureReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
