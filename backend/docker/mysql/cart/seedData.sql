USE ecommerce_cart;

DELETE FROM cart_items;
DELETE FROM carts;

INSERT INTO carts (
    id,
    user_id
) VALUES
    (1, 1),
    (2, 2),
    (3, 3);

INSERT INTO cart_items (
    id,
    cart_id,
    product_id,
    quantity
) VALUES

-- User 1
(1, 1, 1, 2),
(2, 1, 3, 1),
(3, 1, 5, 3),

-- User 2
(4, 2, 2, 1),
(5, 2, 4, 2),

-- User 3
(6, 3, 6, 1),
(7, 3, 7, 2),
(8, 3, 9, 1);

