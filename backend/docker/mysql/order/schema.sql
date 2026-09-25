CREATE DATABASE IF NOT EXISTS ecommerce_order
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_order.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_order;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    status ENUM(
        'PENDING_PAYMENT',
        'PAID',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING_PAYMENT',

    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_orders_user_id (user_id),

    INDEX idx_orders_status (status),

    INDEX idx_orders_created_at (created_at)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT NOT NULL AUTO_INCREMENT,

    order_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    product_name VARCHAR(255) NOT NULL,

    unit_price DECIMAL(12,2) NOT NULL,

    quantity INT NOT NULL,

    subtotal DECIMAL(12,2) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_order_items_order_id (order_id),

    INDEX idx_order_items_product_id (product_id),

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

ALTER TABLE orders
ADD COLUMN subtotal DECIMAL(12,2) NOT NULL DEFAULT 0
AFTER status,

ADD COLUMN discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0
AFTER subtotal,

ADD COLUMN promotion_code VARCHAR(50)
AFTER discount_amount;