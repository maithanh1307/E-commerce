package com.ecommerce.payment_service.service;

import com.ecommerce.payment_service.client.OrderClient;
import com.ecommerce.payment_service.dto.CreatePaymentRequestDto;
import com.ecommerce.payment_service.dto.OrderResponseDto;
import com.ecommerce.payment_service.dto.PaymentResponseDto;
import com.ecommerce.payment_service.entity.OrderStatus;
import com.ecommerce.payment_service.entity.Payment;
import com.ecommerce.payment_service.entity.PaymentStatus;
import com.ecommerce.payment_service.event.EcommerceEvent;
import com.ecommerce.payment_service.event.KafkaEventPublisher;
import com.ecommerce.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    private final KafkaEventPublisher kafkaEventPublisher;

    @Transactional
//    public PaymentResponseDto createPayment(
//            CreatePaymentRequestDto request) {
//
//        // check exsiting payment
//        paymentRepository
//                .findByOrderId(request.getOrderId())
//                .ifPresent(payment -> {
//                    throw new RuntimeException(
//                            "Payment already exists for order: "
//                                    + request.getOrderId()
//                    );
//                });
//
//        // get order
//        OrderResponseDto order =
//                orderClient.getOrder(
//                        request.getUserId(),
//                        request.getOrderId()
//                );
//
//        if (order == null) {
//            throw new RuntimeException(
//                    "Order not found"
//            );
//        }
//
//        // check user
//        if (!order.getUserId()
//                .equals(request.getUserId())) {
//
//            throw new RuntimeException(
//                    "Order does not belong to user"
//            );
//        }
//
//        // check order status
//        if (order.getStatus() !=
//                com.ecommerce.payment_service.entity.OrderStatus
//                        .PENDING_PAYMENT) {
//
//            throw new RuntimeException(
//                    "Order is not waiting for payment"
//            );
//        }
//
//        // create payment
//        Payment payment = Payment.builder()
//                .orderId(order.getId())
//                .userId(order.getUserId())
//                .amount(order.getTotalAmount())
//                .paymentMethod(request.getPaymentMethod())
//                .status(PaymentStatus.PENDING)
//                .build();
//
//        Payment saved =
//                paymentRepository.save(payment);
//
//        // kafka
//        EcommerceEvent event = EcommerceEvent.builder()
//                .eventId(UUID.randomUUID().toString())
//                .eventType("PAYMENT_SUCCESS")
//                .occurredAt(LocalDateTime.now())
//                .userId(payment.getUserId())
//                .referenceId(payment.getOrderId())
//                .referenceType("ORDER")
//                .payload(Map.of(
//                        "amount", payment.getAmount(),
//                        "paymentMethod", payment.getPaymentMethod().name(),
//                        "transactionId", payment.getTransactionId()
//                ))
//                .build();
//
//        kafkaEventPublisher.publish(
//                "payment-events",
//                payment.getOrderId().toString(),
//                event
//        );
//
//        return toResponse(saved);
//    }
    public PaymentResponseDto createPayment(
            CreatePaymentRequestDto request) {

        // 1. Check existing payment
        paymentRepository
                .findByOrderId(request.getOrderId())
                .ifPresent(payment -> {
                    throw new RuntimeException(
                            "Payment already exists for order: "
                                    + request.getOrderId()
                    );
                });

        // 2. Get order
        OrderResponseDto order =
                orderClient.getOrder(
                        request.getUserId(),
                        request.getOrderId()
                );

        if (order == null) {
            throw new RuntimeException(
                    "Order not found"
            );
        }

        // 3. Check user
        if (!order.getUserId()
                .equals(request.getUserId())) {

            throw new RuntimeException(
                    "Order does not belong to user"
            );
        }

        // 4. Check order status
        if (order.getStatus()
                != OrderStatus.PENDING_PAYMENT) {

            throw new RuntimeException(
                    "Order is not waiting for payment"
            );
        }

        // 5. Create payment
        Payment payment = Payment.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .amount(order.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .build();

        Payment saved =
                paymentRepository.save(payment);

        // 6. Mock payment processing
        saved.setStatus(PaymentStatus.SUCCESS);

        saved.setTransactionId(
                "MOCK-TXN-" + UUID.randomUUID()
        );

        saved.setFailureReason(null);

        // 7. Save successful payment
        saved = paymentRepository.save(saved);

        // 8. Create Kafka event
        EcommerceEvent event = EcommerceEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType("PAYMENT_SUCCESS")
                .occurredAt(LocalDateTime.now())
                .userId(saved.getUserId())
                .referenceId(saved.getOrderId())
                .referenceType("ORDER")
                .payload(Map.of(
                        "amount", saved.getAmount(),
                        "paymentMethod",
                        saved.getPaymentMethod().name(),
                        "transactionId",
                        saved.getTransactionId()
                ))
                .build();

        // 9. Publish Kafka event
        kafkaEventPublisher.publish(
                "payment-events",
                saved.getOrderId().toString(),
                event
        );

        // 10. Return response
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPayment(Long id) {

        Payment payment =
                paymentRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment not found"
                                )
                        );

        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByOrder(
            Long orderId) {

        Payment payment =
                paymentRepository
                        .findByOrderId(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment not found"
                                )
                        );

        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getUserPayments(
            Long userId) {

        return paymentRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

//    @Transactional
//    public PaymentResponseDto confirmPayment(
//            Long id) {
//
//        Payment payment =
//                paymentRepository.findById(id)
//                        .orElseThrow(
//                                () -> new RuntimeException(
//                                        "Payment not found"
//                                )
//                        );
//
//        if (payment.getStatus() ==
//                PaymentStatus.SUCCESS) {
//
//            return toResponse(payment);
//        }
//
//        if (payment.getStatus() ==
//                PaymentStatus.CANCELLED) {
//
//            throw new RuntimeException(
//                    "Payment is cancelled"
//            );
//        }
//
//        // Mock transaction
//        String transactionId =
//                "MOCK-TXN-" +
//                        UUID.randomUUID()
//                                .toString()
//                                .substring(0, 8)
//                                .toUpperCase();
//
//        payment.setStatus(
//                PaymentStatus.SUCCESS
//        );
//
//        payment.setTransactionId(
//                transactionId
//        );
//
//        payment.setFailureReason(null);
//
//        Payment saved =
//                paymentRepository.save(payment);
//
//        return toResponse(saved);
//    }

    @Transactional
    public PaymentResponseDto confirmPayment(Long paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found"
                                )
                        );

        if (payment.getStatus()
                == PaymentStatus.SUCCESS) {

            return toResponse(payment);
        }

        if (payment.getStatus()
                == PaymentStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled payment cannot be confirmed"
            );
        }

        String transactionId =
                "MOCK-TXN-"
                        + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        payment.setTransactionId(transactionId);
        payment.setStatus(PaymentStatus.SUCCESS);

        Payment savedPayment =
                paymentRepository.save(payment);

        // Update Order -> PAID
        orderClient.markOrderAsPaid(
                payment.getUserId(),
                payment.getOrderId()
        );

        return toResponse(savedPayment);
    }

    @Transactional
    public PaymentResponseDto failPayment(
            Long id,
            String reason) {

        Payment payment =
                paymentRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment not found"
                                )
                        );

        if (payment.getStatus() ==
                PaymentStatus.SUCCESS) {

            throw new RuntimeException(
                    "Successful payment cannot be failed"
            );
        }

        payment.setStatus(
                PaymentStatus.FAILED
        );

        payment.setFailureReason(reason);

        Payment saved =
                paymentRepository.save(payment);

        return toResponse(saved);
    }

    private PaymentResponseDto toResponse(
            Payment payment) {

        return PaymentResponseDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .paymentMethod(
                        payment.getPaymentMethod()
                )
                .status(payment.getStatus())
                .transactionId(
                        payment.getTransactionId()
                )
                .failureReason(
                        payment.getFailureReason()
                )
                .createdAt(
                        payment.getCreatedAt()
                )
                .updatedAt(
                        payment.getUpdatedAt()
                )
                .build();
    }
}
