package com.ecommerce.promotion_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "promotions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_promotions_code",
                        columnNames = "code"
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 50,
            unique = true
    )
    private String code;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "discount_type",
            nullable = false
    )
    private DiscountType discountType;

    @Column(
            name = "discount_value",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal discountValue;

    @Column(
            name = "minimum_order_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal minimumOrderAmount;

    @Column(
            name = "maximum_discount_amount",
            precision = 12,
            scale = 2
    )
    private BigDecimal maximumDiscountAmount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(
            name = "used_count",
            nullable = false
    )
    private Integer usedCount;

    @Column(
            name = "start_at",
            nullable = false
    )
    private LocalDateTime startAt;

    @Column(
            name = "end_at",
            nullable = false
    )
    private LocalDateTime endAt;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false
    )
    private PromotionStatus status;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (usedCount == null) {
            usedCount = 0;
        }

        if (status == null) {
            status = PromotionStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
