CREATE DATABASE IF NOT EXISTS ecommerce_review
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_review.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_review;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT NOT NULL AUTO_INCREMENT,

    product_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    order_id BIGINT NOT NULL,

    rating INT NOT NULL,

    comment VARCHAR(1000),

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_review_user_product_order (
        user_id,
        product_id,
        order_id
    ),

    INDEX idx_reviews_product_id (
        product_id
    ),

    INDEX idx_reviews_user_id (
        user_id
    ),

    INDEX idx_reviews_order_id (
        order_id
    ),

    INDEX idx_reviews_status (
        status
    ),

    INDEX idx_reviews_rating (
        rating
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;