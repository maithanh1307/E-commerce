package com.ecommerce.notification_service.dto;

import com.ecommerce.notification_service.entity.NotificationStatus;
import com.ecommerce.notification_service.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {
    private Long id;

    private Long userId;

    private NotificationType type;

    private String title;

    private String message;

    private Long referenceId;

    private String referenceType;

    private NotificationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}
