USE ecommerce_product;

DELETE FROM products;

ALTER TABLE products AUTO_INCREMENT = 1;

INSERT INTO products (
    name,
    description,
    price,
    image_url,
    category,
    stock_quantity,
    status
)
VALUES

(
    'Cute Brown Bear',
    'A cute and soft brown teddy bear, perfect for gifts and decoration.',
    25000.99,
    'https://placehold.co/600x600?text=Cute+Brown+Bear',
    'Bear',
    100,
    'ACTIVE'
),

(
    'Classic Teddy Bear',
    'A classic teddy bear with soft brown fur and a friendly appearance.',
    29000.99,
    'https://placehold.co/600x600?text=Classic+Teddy+Bear',
    'Bear',
    80,
    'ACTIVE'
),

(
    'White Teddy Bear',
    'A soft white teddy bear suitable for children and special occasions.',
    27000.50,
    'https://placehold.co/600x600?text=White+Teddy+Bear',
    'Bear',
    75,
    'ACTIVE'
),

(
    'Pink Love Bear',
    'A lovely pink teddy bear designed as a romantic gift.',
    32000.99,
    'https://placehold.co/600x600?text=Pink+Love+Bear',
    'Bear',
    60,
    'ACTIVE'
),

(
    'Mini Teddy Bear',
    'A small and adorable teddy bear that is easy to carry anywhere.',
    15000.99,
    'https://placehold.co/600x600?text=Mini+Teddy+Bear',
    'Bear',
    120,
    'ACTIVE'
),

(
    'Giant Teddy Bear',
    'A large teddy bear with extremely soft fur, perfect for hugging.',
    89000.99,
    'https://placehold.co/600x600?text=Giant+Teddy+Bear',
    'Bear',
    25,
    'ACTIVE'
),

(
    'Cream Fluffy Bear',
    'A fluffy cream-colored bear with a soft and comfortable texture.',
    34000.99,
    'https://placehold.co/600x600?text=Cream+Fluffy+Bear',
    'Bear',
    55,
    'ACTIVE'
),

(
    'Brown Bear With Heart',
    'A cute brown bear holding a heart, perfect for birthdays and anniversaries.',
    36000.99,
    'https://placehold.co/600x600?text=Brown+Bear+Heart',
    'Bear',
    45,
    'ACTIVE'
),

(
    'Sleepy Bear',
    'A sleepy teddy bear designed with a cute sleeping expression.',
    28000.99,
    'https://placehold.co/600x600?text=Sleepy+Bear',
    'Bear',
    70,
    'ACTIVE'
),

(
    'Honey Bear',
    'A cute honey-colored teddy bear with a cheerful expression.',
    31000.50,
    'https://placehold.co/600x600?text=Honey+Bear',
    'Bear',
    65,
    'ACTIVE'
),

(
    'Cute Bunny Plush',
    'A soft white bunny plush with long ears and a cute face.',
    24000.99,
    'https://placehold.co/600x600?text=Cute+Bunny',
    'Bunny',
    90,
    'ACTIVE'
),

(
    'Pink Bunny Plush',
    'A lovely pink bunny plush that makes a perfect gift for children.',
    26000.99,
    'https://placehold.co/600x600?text=Pink+Bunny',
    'Bunny',
    85,
    'ACTIVE'
),

(
    'White Rabbit Plush',
    'A fluffy white rabbit plush with a soft and gentle appearance.',
    29000.50,
    'https://placehold.co/600x600?text=White+Rabbit',
    'Bunny',
    50,
    'ACTIVE'
),

(
    'Cute Cat Plush',
    'A cute cat plush with soft fur and a playful expression.',
    22000.99,
    'https://placehold.co/600x600?text=Cute+Cat',
    'Cat',
    95,
    'ACTIVE'
),

(
    'Sleepy Cat Plush',
    'A soft sleepy cat plush designed for relaxing and cuddling.',
    27000.99,
    'https://placehold.co/600x600?text=Sleepy+Cat',
    'Cat',
    70,
    'ACTIVE'
),

(
    'Orange Cat Plush',
    'An adorable orange cat plush inspired by a friendly house cat.',
    25000.50,
    'https://placehold.co/600x600?text=Orange+Cat',
    'Cat',
    80,
    'ACTIVE'
),

(
    'Cute Panda Plush',
    'A soft black and white panda plush with a cute and friendly face.',
    35000.99,
    'https://placehold.co/600x600?text=Cute+Panda',
    'Panda',
    65,
    'ACTIVE'
),

(
    'Baby Panda Plush',
    'A small baby panda plush with a soft body and adorable appearance.',
    23000.99,
    'https://placehold.co/600x600?text=Baby+Panda',
    'Panda',
    100,
    'ACTIVE'
),

(
    'Red Panda Plush',
    'A cute red panda plush with a fluffy tail and soft fur.',
    39000.99,
    'https://placehold.co/600x600?text=Red+Panda',
    'Panda',
    40,
    'ACTIVE'
),

(
    'Cute Capybara Plush',
    'A cute and relaxing capybara plush with a soft brown body.',
    42000.99,
    'https://placehold.co/600x600?text=Capybara',
    'Other',
    45,
    'ACTIVE'
);