package com.ecommerce.product_service.service;

import com.ecommerce.product_service.dto.ProductResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PRODUCT_KEY = "product:";
    private static final String ALL_PRODUCTS_KEY = "products:all";

    public void save(ProductResponseDto product) {

        redisTemplate.opsForValue().set(
                PRODUCT_KEY + product.getId(),
                product
        );
    }

    public ProductResponseDto get(Long id) {

        Object cached = redisTemplate.opsForValue()
                .get(PRODUCT_KEY + id);

        if (cached == null) {
            return null;
        }

        return objectMapper.convertValue(
                cached,
                ProductResponseDto.class
        );
    }

    public void delete(Long id) {

        redisTemplate.delete(
                PRODUCT_KEY + id
        );
    }

    public void saveAll(List<ProductResponseDto> products) {

        redisTemplate.opsForValue().set(
                ALL_PRODUCTS_KEY,
                products
        );
    }

    public List<ProductResponseDto> getAll() {

        Object cached = redisTemplate.opsForValue()
                .get(ALL_PRODUCTS_KEY);

        if (cached == null) {
            return null;
        }

        return objectMapper.convertValue(
                cached,
                objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                ProductResponseDto.class
                        )
        );
    }

    public void deleteAll() {

        redisTemplate.delete(ALL_PRODUCTS_KEY);
    }
}