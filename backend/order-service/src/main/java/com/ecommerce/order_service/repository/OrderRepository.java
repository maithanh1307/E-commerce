package com.ecommerce.order_service.repository;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    Optional<Order> findByIdAndUserId(
            Long id,
            Long userId
    );

    List<Order> findByStatus(
            OrderStatus status
    );
}
