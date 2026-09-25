package com.ecommerce.order_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {
    private String promotionCode;
}
