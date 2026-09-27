package com.ecommerce.notification_service.repository;


import com.ecommerce.notification_service.entity.Notification;
import com.ecommerce.notification_service.entity.NotificationStatus;
import com.ecommerce.notification_service.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(
            Long userId,
            NotificationStatus status
    );

    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(
            Long userId,
            NotificationType type
    );

    long countByUserIdAndStatus(
            Long userId,
            NotificationStatus status
    );
}
