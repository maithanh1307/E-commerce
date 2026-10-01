import type { Product } from '../models/Product';
import teddyBear from '../assets/bear.jpg';
import bunny from '../assets/bunny.jpg';
import cat from '../assets/cat.jpg';
import penguin from '../assets/penguin.jpg';
import dino from '../assets/dinosaur.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Teddy Bear',
    description:
      'A soft and cuddly teddy bear, perfect for gifts and everyday companionship.',
    price: 15.99,
    imageUrl: teddyBear,
    category: 'Bears',
    stockQuantity: 25,
    rating: 4.8,
    reviews: 120,
  },

  {
    id: 2,
    name: 'Bunny with Carrot',
    description:
      'An adorable bunny plush holding a cute carrot. Soft, cozy, and perfect for bunny lovers.',
    price: 12.99,
    imageUrl: bunny,
    category: 'Rabbits',
    stockQuantity: 18,
    rating: 4.9,
    reviews: 98,
  },

  {
    id: 3,
    name: 'Cute Penguin Plush',
    description:
      'A cute penguin plush with a soft texture, ideal for children and penguin lovers.',
    price: 14.99,
    imageUrl: penguin,
    category: 'Others',
    stockQuantity: 30,
    rating: 4.7,
    reviews: 95,
  },

  {
    id: 4,
    name: 'Fluffy Cat Plush',
    description:
      'A fluffy and adorable cat plush that makes a perfect companion for your room.',
    price: 13.99,
    imageUrl: cat,
    category: 'Cats',
    stockQuantity: 22,
    rating: 4.6,
    reviews: 76,
  },

  {
    id: 5,
    name: 'Little Dinosaur Plush',
    description:
      'A cute dinosaur plush with a soft body and friendly design for dinosaur fans.',
    price: 16.99,
    imageUrl: dino,
    category: 'Others',
    stockQuantity: 15,
    rating: 4.8,
    reviews: 64,
  },
];