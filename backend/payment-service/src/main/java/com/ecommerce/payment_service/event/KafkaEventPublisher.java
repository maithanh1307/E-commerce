package com.ecommerce.payment_service.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publish(
            String topic,
            String key,
            EcommerceEvent event
    ) {

        try {

            String message =
                    objectMapper.writeValueAsString(event);

            kafkaTemplate.send(
                    topic,
                    key,
                    message
            );

            log.info(
                    "Kafka event published. topic={}, eventType={}",
                    topic,
                    event.getEventType()
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Failed to serialize Kafka event",
                    e
            );
        }
    }
}
