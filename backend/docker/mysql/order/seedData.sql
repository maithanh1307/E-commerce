USE ecommerce_order;

DELETE FROM orders;

INSERT INTO orders (
    id,
    user_id,
    status,
    total_amount
) VALUES

-- User 1
(1, 1, 'PAID', 597000),

-- User 2
(2, 2, 'PENDING_PAYMENT', 947000),

-- User 3
(3, 3, 'PAID', 1547000),


-- Another order for User 1
(6, 1, 'PENDING_PAYMENT', 648000);


INSERT INTO order_items (
    id,
    order_id,
    product_id,
    product_name,
    unit_price,
    quantity,
    subtotal
) VALUES

(1, 1, 1, 'Cute Teddy Bear', 199000, 1, 199000),
(2, 1, 3, 'Brown Teddy Bear', 299000, 1, 299000),
(3, 1, 5, 'Pink Teddy Bear', 99000, 1, 99000),


(4, 2, 2, 'Classic Teddy Bear', 249000, 1, 249000),
(5, 2, 4, 'Big Teddy Bear', 349000, 2, 698000),


(6, 3, 6, 'White Teddy Bear', 449000, 1, 449000),
(7, 3, 7, 'Premium Teddy Bear', 499000, 2, 998000),
(8, 3, 9, 'Mini Teddy Bear', 100000, 1, 100000),



(12, 6, 10, 'Large Teddy Bear', 649000, 1, 649000);