import type { Product } from "./Product";

export type CartItem = {
    key: string; 
    productId: Product['id'];
    name: string;
    price: number;
    originalPrice?: number;
    imageUrl: string | null;
    color?: string;
    size?: string;
    quantity: number;
    maxQuantity: number;
};