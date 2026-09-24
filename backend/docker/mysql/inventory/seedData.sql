USE ecommerce_inventory;

DELETE FROM inventory;

INSERT INTO inventory (
    id,
    product_id,
    quantity,
    reserved_quantity
) VALUES
    (1, 1, 100, 5),
    (2, 2, 80, 10),
    (3, 3, 50, 3),
    (4, 4, 120, 15),
    (5, 5, 60, 8),
    (6, 6, 40, 2),
    (7, 7, 90, 12),
    (8, 8, 30, 5),
    (9, 9, 75, 0),
    (10, 10, 25, 4);


INSERT INTO stock_movements (
    id,
    product_id,
    type,
    quantity,
    reason
) VALUES

-- Product 1
(1, 1, 'IN', 100, 'Initial stock'),

-- Product 2
(2, 2, 'IN', 100, 'Initial stock'),
(3, 2, 'OUT', 20, 'Customer orders'),

-- Product 3
(4, 3, 'IN', 60, 'Initial stock'),
(5, 3, 'OUT', 7, 'Customer orders'),

-- Product 4
(6, 4, 'IN', 150, 'Initial stock'),
(7, 4, 'OUT', 30, 'Customer orders'),

-- Product 5
(8, 5, 'IN', 80, 'Initial stock'),
(9, 5, 'OUT', 20, 'Customer orders'),

-- Product 6
(10, 6, 'IN', 50, 'Initial stock'),
(11, 6, 'OUT', 10, 'Customer orders'),

-- Product 7
(12, 7, 'IN', 100, 'Initial stock'),
(13, 7, 'OUT', 10, 'Customer orders'),

-- Product 8
(14, 8, 'IN', 40, 'Initial stock'),
(15, 8, 'OUT', 10, 'Customer orders'),

-- Product 9
(16, 9, 'IN', 75, 'Initial stock'),

-- Product 10
(17, 10, 'IN', 30, 'Initial stock'),
(18, 10, 'OUT', 5, 'Customer orders');


INSERT INTO stock_movements (
    id,
    product_id,
    type,
    quantity,
    reason
) VALUES
    (19, 1, 'RESERVE', 5, 'Pending order reservation'),
    (20, 2, 'RESERVE', 10, 'Pending order reservation'),
    (21, 3, 'RESERVE', 3, 'Pending order reservation'),
    (22, 4, 'RESERVE', 15, 'Pending order reservation'),
    (23, 5, 'RESERVE', 8, 'Pending order reservation'),
    (24, 6, 'RESERVE', 2, 'Pending order reservation'),
    (25, 7, 'RESERVE', 12, 'Pending order reservation'),
    (26, 8, 'RESERVE', 5, 'Pending order reservation'),
    (27, 10, 'RESERVE', 4, 'Pending order reservation');