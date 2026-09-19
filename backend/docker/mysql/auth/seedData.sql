USE ecommerce_auth;

DELETE FROM users;

INSERT INTO users (
    email,
    password,
    full_name,
    role,
    enabled
)
VALUES

(
    'customer@ecommerce.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Customer 1',
    'CUSTOMER',
    TRUE
),

(
    'seller@ecommerce.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Seller 1',
    'SELLER',
    TRUE
),

(
    'staff@ecommerce.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Staff 1',
    'STAFF',
    TRUE
),

(
    'admin@ecommerce.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Administrator 1',
    'ADMIN',
    TRUE
);