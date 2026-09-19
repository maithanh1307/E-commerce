CREATE DATABASE IF NOT EXISTS ecommerce_auth
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce_auth;



CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,

    email VARCHAR(255) NOT NULL,

    password VARCHAR(255) NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    role ENUM(
        'CUSTOMER',
        'SELLER',
        'STAFF',
        'ADMIN'
    ) NOT NULL DEFAULT 'CUSTOMER',

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_users_email (email),

    INDEX idx_users_role (role),

    INDEX idx_users_enabled (enabled)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;