package com.ecommerce.notification_service.event;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EcommerceEvent {
    private String eventId;

    private String eventType;

    private LocalDateTime occurredAt;

    private Long userId;

    private Long referenceId;

    private String referenceType;

    private Map<String, Object> payload;
}
