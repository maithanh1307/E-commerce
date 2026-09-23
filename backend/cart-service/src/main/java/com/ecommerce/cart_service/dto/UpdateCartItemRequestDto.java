package com.ecommerce.cart_service.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequestDto {
    @NotNull
    @Min(1)
    private Integer quantity;
}
