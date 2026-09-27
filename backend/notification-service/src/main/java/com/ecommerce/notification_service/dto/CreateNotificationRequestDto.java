package com.ecommerce.notification_service.dto;

import com.ecommerce.notification_service.entity.NotificationType;
import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequestDto {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Title is required")
    @Size(
            max = 255,
            message = "Title must not exceed 255 characters"
    )
    private String title;

    @NotBlank(message = "Message is required")
    @Size(
            max = 1000,
            message = "Message must not exceed 1000 characters"
    )
    private String message;

    private Long referenceId;

    @Size(
            max = 50,
            message = "Reference type must not exceed 50 characters"
    )
    private String referenceType;
}
