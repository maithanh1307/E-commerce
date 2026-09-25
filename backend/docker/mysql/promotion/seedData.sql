USE ecommerce_promotion;

DELETE FROM promotions;

INSERT INTO promotions (
    id,
    code,
    description,
    discount_type,
    discount_value,
    minimum_order_amount,
    maximum_discount_amount,
    usage_limit,
    used_count,
    start_at,
    end_at,
    status
) VALUES
(
    1,
    'WELCOME10',
    '10% discount for new customers',
    'PERCENTAGE',
    10.00,
    100000.00,
    100000.00,
    1000,
    0,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'ACTIVE'
),
(
    2,
    'TEDDY50',
    '50,000 VND discount for teddy bear orders',
    'FIXED',
    50000.00,
    300000.00,
    NULL,
    500,
    0,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'ACTIVE'
),
(
    3,
    'BEAR20',
    '20% discount for large orders',
    'PERCENTAGE',
    20.00,
    500000.00,
    150000.00,
    300,
    0,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'ACTIVE'
),
(
    4,
    'OLDPROMO',
    'Inactive promotion',
    'PERCENTAGE',
    15.00,
    100000.00,
    100000.00,
    100,
    0,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'INACTIVE'
);

(
    5,
    'NEWPROMO',
    'New promotion',
    'PERCENTAGE',
    20.00,
    20000.00,
    50000.00,
    100,
    0,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'INACTIVE'
);