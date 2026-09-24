CREATE DATABASE IF NOT EXISTS ecommerce_payment
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_payment.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_payment;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT NOT NULL AUTO_INCREMENT,

    order_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    payment_method ENUM(
        'COD',
        'BANK_TRANSFER',
        'MOCK'
    ) NOT NULL,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',

    transaction_id VARCHAR(255),

    failure_reason VARCHAR(500),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_payment_order_id (order_id),

    INDEX idx_payment_user_id (user_id),

    INDEX idx_payment_status (status),

    INDEX idx_payment_transaction_id (transaction_id)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;