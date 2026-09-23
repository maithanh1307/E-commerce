CREATE DATABASE IF NOT EXISTS ecommerce_inventory
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_inventory.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_inventory;

CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT NOT NULL AUTO_INCREMENT,

    product_id BIGINT NOT NULL,

    quantity INT NOT NULL DEFAULT 0,

    reserved_quantity INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_inventory_product_id (product_id),

    INDEX idx_inventory_product_id (product_id)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS stock_movements (
    id BIGINT NOT NULL AUTO_INCREMENT,

    product_id BIGINT NOT NULL,

    type ENUM(
        'IN',
        'OUT',
        'RESERVE',
        'RELEASE'
    ) NOT NULL,

    quantity INT NOT NULL,

    reason VARCHAR(255),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_stock_movements_product_id (product_id),

    INDEX idx_stock_movements_type (type),

    INDEX idx_stock_movements_created_at (created_at)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;