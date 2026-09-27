package com.ecommerce.notification_service.controller;

import com.ecommerce.notification_service.dto.CreateNotificationRequestDto;
import com.ecommerce.notification_service.dto.NotificationResponseDto;
import com.ecommerce.notification_service.entity.NotificationType;
import com.ecommerce.notification_service.service.NotificationService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;


    // create

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NotificationResponseDto createNotification(
            @Valid
            @RequestBody
            CreateNotificationRequestDto request) {

        return notificationService.createNotification(
                request
        );
    }


    // get by id

    @GetMapping("/{id}")
    public NotificationResponseDto getNotification(
            @PathVariable Long id) {

        return notificationService.getNotification(
                id
        );
    }

    // get user noti

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDto>
    getUserNotifications(
            @PathVariable Long userId) {

        return notificationService
                .getUserNotifications(userId);
    }


    // get unread

    @GetMapping("/user/{userId}/unread")
    public List<NotificationResponseDto>
    getUnreadNotifications(
            @PathVariable Long userId) {

        return notificationService
                .getUnreadNotifications(userId);
    }


    // get by type

    @GetMapping("/user/{userId}/type/{type}")
    public List<NotificationResponseDto>
    getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type) {

        return notificationService
                .getNotificationsByType(
                        userId,
                        type
                );
    }


    // count read

    @GetMapping("/user/{userId}/unread/count")
    public long countUnread(
            @PathVariable Long userId) {

        return notificationService
                .countUnread(userId);
    }


    // mark as read

    @PatchMapping("/{id}/read/user/{userId}")
    public NotificationResponseDto markAsRead(
            @PathVariable Long id,
            @PathVariable Long userId) {

        return notificationService
                .markAsRead(
                        id,
                        userId
                );
    }


    // mark all as read

    @PatchMapping("/user/{userId}/read-all")
    public String markAllAsRead(
            @PathVariable Long userId) {

        int count =
                notificationService
                        .markAllAsRead(userId);

        return count
                + " notifications marked as read";
    }


    // delete

    @DeleteMapping("/{id}/user/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotification(
            @PathVariable Long id,
            @PathVariable Long userId) {

        notificationService
                .deleteNotification(
                        id,
                        userId
                );
    }
}
