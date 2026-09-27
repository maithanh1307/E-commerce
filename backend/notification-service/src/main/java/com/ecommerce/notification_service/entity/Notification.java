package com.ecommerce.notification_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notifications"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            name = "user_id",
            nullable = false
    )
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false
    )
    private NotificationType type;

    @Column(
            nullable = false
    )
    private String title;

    @Column(
            nullable = false,
            length = 1000
    )
    private String message;

    @Column(
            name = "reference_id"
    )
    private Long referenceId;

    @Column(
            name = "reference_type",
            length = 50
    )
    private String referenceType;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false
    )
    private NotificationStatus status;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "read_at"
    )
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = NotificationStatus.UNREAD;
        }
    }
}
