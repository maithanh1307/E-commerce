CREATE DATABASE IF NOT EXISTS ecommerce_notification
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES
ON ecommerce_notification.*
TO 'ecommerce'@'%';

FLUSH PRIVILEGES;

USE ecommerce_notification;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    type ENUM(
        'ORDER_CREATED',
        'PAYMENT_SUCCESS',
        'ORDER_CANCELLED',
        'REVIEW_CREATED',
        'PROMOTION',
        'SYSTEM'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message VARCHAR(1000) NOT NULL,

    reference_id BIGINT,

    reference_type VARCHAR(50),

    status ENUM(
        'UNREAD',
        'READ'
    ) NOT NULL DEFAULT 'UNREAD',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    read_at DATETIME NULL,

    PRIMARY KEY (id),

    INDEX idx_notifications_user_id (
        user_id
    ),

    INDEX idx_notifications_user_status (
        user_id,
        status
    ),

    INDEX idx_notifications_type (
        type
    ),

    INDEX idx_notifications_created_at (
        created_at
    )

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;