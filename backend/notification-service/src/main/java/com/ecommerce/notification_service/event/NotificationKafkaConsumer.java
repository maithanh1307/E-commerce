package com.ecommerce.notification_service.event;

import com.ecommerce.notification_service.entity.Notification;
import com.ecommerce.notification_service.entity.NotificationType;
import com.ecommerce.notification_service.repository.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationKafkaConsumer {
    private final ObjectMapper objectMapper;
    private final NotificationRepository notificationRepository;

    @KafkaListener(
            topics = "order-events",
            groupId = "notification-service"
    )
    public void consumeOrderEvent(String message) {

        log.info("Received order event: {}", message);

        try {

            EcommerceEvent event =
                    objectMapper.readValue(
                            message,
                            EcommerceEvent.class
                    );

            if ("ORDER_CREATED".equals(event.getEventType())) {

                createNotification(
                        event,
                        NotificationType.ORDER_CREATED,
                        "Order created",
                        "Your order #" + event.getReferenceId()
                                + " has been created successfully."
                );
            }

        } catch (Exception e) {

            log.error(
                    "Failed to process order event: {}",
                    message,
                    e
            );
        }
    }


    @KafkaListener(
            topics = "payment-events",
            groupId = "notification-service"
    )
    public void consumePaymentEvent(String message) {

        log.info("Received payment event: {}", message);

        try {

            EcommerceEvent event =
                    objectMapper.readValue(
                            message,
                            EcommerceEvent.class
                    );

            if ("PAYMENT_SUCCESS".equals(event.getEventType())) {

                createNotification(
                        event,
                        NotificationType.PAYMENT_SUCCESS,
                        "Payment successful",
                        "Payment for order #"
                                + event.getReferenceId()
                                + " was successful."
                );
            }

        } catch (Exception e) {

            log.error(
                    "Failed to process payment event: {}",
                    message,
                    e
            );
        }
    }


    @KafkaListener(
            topics = "review-events",
            groupId = "notification-service"
    )
    public void consumeReviewEvent(String message) {

        log.info("Received review event: {}", message);

        try {

            EcommerceEvent event =
                    objectMapper.readValue(
                            message,
                            EcommerceEvent.class
                    );

            if ("REVIEW_CREATED".equals(event.getEventType())) {

                createNotification(
                        event,
                        NotificationType.REVIEW_CREATED,
                        "Review submitted",
                        "Your review for product #"
                                + event.getReferenceId()
                                + " has been submitted."
                );
            }

        } catch (Exception e) {

            log.error(
                    "Failed to process review event: {}",
                    message,
                    e
            );
        }
    }


    private void createNotification(
            EcommerceEvent event,
            NotificationType type,
            String title,
            String message
    ) {

        Notification notification = new Notification();

        notification.setUserId(event.getUserId());
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceId(event.getReferenceId());
        notification.setReferenceType(event.getReferenceType());

        notificationRepository.save(notification);

        log.info(
                "Notification created for user {}",
                event.getUserId()
        );
    }
}
