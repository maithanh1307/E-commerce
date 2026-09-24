package com.ecommerce.payment_service.dto;

import com.ecommerce.payment_service.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequestDto {
    @NotNull
    private Long orderId;

    @NotNull
    private Long userId;

    @NotNull
    private PaymentMethod paymentMethod;
}
