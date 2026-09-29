package com.ecommerce.cart_service.service;

import com.ecommerce.cart_service.dto.CartResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CartCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CART_PREFIX = "cart:user:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    public CartResponseDto get(Long userId) {

        String key = CART_PREFIX + userId;

        Object cached = redisTemplate.opsForValue().get(key);

        if (cached == null) {
            return null;
        }

        return objectMapper.convertValue(cached, CartResponseDto.class);
    }

    public void save(CartResponseDto cart) {

        String key = CART_PREFIX + cart.getUserId();

        redisTemplate.opsForValue().set(
                key,
                cart,
                CACHE_TTL
        );
    }

    public void delete(Long userId) {

        String key = CART_PREFIX + userId;

        redisTemplate.delete(key);
    }
}