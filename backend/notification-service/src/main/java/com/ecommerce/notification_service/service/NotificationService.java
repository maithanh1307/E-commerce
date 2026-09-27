package com.ecommerce.notification_service.service;

import com.ecommerce.notification_service.dto.CreateNotificationRequestDto;
import com.ecommerce.notification_service.dto.NotificationResponseDto;
import com.ecommerce.notification_service.entity.Notification;
import com.ecommerce.notification_service.entity.NotificationStatus;
import com.ecommerce.notification_service.entity.NotificationType;
import com.ecommerce.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    // create
    @Transactional
    public NotificationResponseDto createNotification(
            CreateNotificationRequestDto request) {

        Notification notification =
                Notification.builder()
                        .userId(request.getUserId())
                        .type(request.getType())
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .referenceId(request.getReferenceId())
                        .referenceType(request.getReferenceType())
                        .status(NotificationStatus.UNREAD)
                        .build();

        Notification saved =
                notificationRepository.save(
                        notification
                );

        return toResponse(saved);
    }


    // get by id

    public NotificationResponseDto getNotification(
            Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        return toResponse(notification);
    }


    // get user notification

    public List<NotificationResponseDto>
    getUserNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // get unread notification

    public List<NotificationResponseDto>
    getUnreadNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(
                        userId,
                        NotificationStatus.UNREAD
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // get by type

    public List<NotificationResponseDto>
    getNotificationsByType(
            Long userId,
            NotificationType type) {

        return notificationRepository
                .findByUserIdAndTypeOrderByCreatedAtDesc(
                        userId,
                        type
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // count unread

    public long countUnread(
            Long userId) {

        return notificationRepository
                .countByUserIdAndStatus(
                        userId,
                        NotificationStatus.UNREAD
                );
    }


    // mark as read

    @Transactional
    public NotificationResponseDto markAsRead(
            Long id,
            Long userId) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to update this notification"
            );
        }

        if (notification.getStatus()
                != NotificationStatus.READ) {

            notification.setStatus(
                    NotificationStatus.READ
            );

            notification.setReadAt(
                    LocalDateTime.now()
            );

            notification =
                    notificationRepository.save(
                            notification
                    );
        }

        return toResponse(notification);
    }


    // mark all as read

    @Transactional
    public int markAllAsRead(
            Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndStatusOrderByCreatedAtDesc(
                                userId,
                                NotificationStatus.UNREAD
                        );

        LocalDateTime now =
                LocalDateTime.now();

        for (Notification notification
                : notifications) {

            notification.setStatus(
                    NotificationStatus.READ
            );

            notification.setReadAt(now);
        }

        notificationRepository.saveAll(
                notifications
        );

        return notifications.size();
    }


    // delete

    @Transactional
    public void deleteNotification(
            Long id,
            Long userId) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to delete this notification"
            );
        }

        notificationRepository.delete(
                notification
        );
    }


    // mapping

    private NotificationResponseDto toResponse(
            Notification notification) {

        return NotificationResponseDto
                .builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceId(
                        notification.getReferenceId()
                )
                .referenceType(
                        notification.getReferenceType()
                )
                .status(notification.getStatus())
                .createdAt(
                        notification.getCreatedAt()
                )
                .readAt(
                        notification.getReadAt()
                )
                .build();
    }
}
