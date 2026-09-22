package com.ecommerce.inventory_service.repository;

import com.ecommerce.inventory_service.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
}
