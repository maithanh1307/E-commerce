package com.ecommerce.promotion_service.repository;

import com.ecommerce.promotion_service.entity.Promotion;
import com.ecommerce.promotion_service.entity.PromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    Optional<Promotion> findByCode(String code);

    boolean existsByCode(String code);

    List<Promotion> findByStatus(PromotionStatus status);

    List<Promotion> findByStatusOrderByCreatedAtDesc(
            PromotionStatus status
    );
}
