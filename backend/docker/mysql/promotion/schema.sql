CREATE DATABASE IF NOT EXISTS ecommerce_promotion
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_promotion.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_promotion;

CREATE TABLE IF NOT EXISTS promotions (
    id BIGINT NOT NULL AUTO_INCREMENT,

    code VARCHAR(50) NOT NULL,

    description VARCHAR(500),

    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL,

    discount_value DECIMAL(12,2) NOT NULL,

    minimum_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0,

    maximum_discount_amount DECIMAL(12,2),

    usage_limit INT,

    used_count INT NOT NULL DEFAULT 0,

    start_at DATETIME NOT NULL,

    end_at DATETIME NOT NULL,

    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_promotions_code (code),

    INDEX idx_promotions_status (status),

    INDEX idx_promotions_start_end (start_at, end_at),

    INDEX idx_promotions_code (code)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;