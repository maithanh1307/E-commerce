package com.ecommerce.promotion_service.service;

import com.ecommerce.promotion_service.dto.PromotionResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class PromotionCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PROMOTION_PREFIX =
            "promotion:";

    private static final Duration CACHE_TTL =
            Duration.ofMinutes(10);

    public PromotionResponseDto get(String code) {

        String normalizedCode =
                code.trim().toUpperCase();

        String key =
                PROMOTION_PREFIX + normalizedCode;

        Object cached =
                redisTemplate.opsForValue().get(key);

        if (cached == null) {
            return null;
        }

        return objectMapper.convertValue(
                cached,
                PromotionResponseDto.class
        );
    }

    public void save(PromotionResponseDto promotion) {

        String code =
                promotion.getCode()
                        .trim()
                        .toUpperCase();

        String key =
                PROMOTION_PREFIX + code;

        redisTemplate.opsForValue().set(
                key,
                promotion,
                CACHE_TTL
        );
    }

    public void delete(String code) {

        String normalizedCode =
                code.trim().toUpperCase();

        String key =
                PROMOTION_PREFIX + normalizedCode;

        redisTemplate.delete(key);
    }
}


