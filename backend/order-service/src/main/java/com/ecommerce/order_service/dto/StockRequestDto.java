package com.ecommerce.order_service.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockRequestDto {
    private Integer quantity;

    private String reason;
}
