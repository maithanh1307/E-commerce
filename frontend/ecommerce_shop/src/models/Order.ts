import type { CartItem } from "./Cart";

export type Address = {
    id: string;
    fullName: string;
    phone: string;
    street: string; 
    ward?: string;
    district: string;
    city: string;
};

export type PaymentMethod = 'cod' | 'bank' | 'mock';

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    cod: 'Cash on Delivery',
    bank: 'Bank Transfer',
    mock: 'Mock Payment',
};

export type OrderItem = Pick<CartItem, 'productId' | 'name' | 'price' | 'quantity' | 'color' | 'size' | 'imageUrl'>;

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const STATUS_LABELS: Record<OrderStatus, string> = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export type Order = {
    id: string;
    createdAt: string;
    items: OrderItem[];
    address: Address;
    paymentMethod: PaymentMethod;
    couponCode?: string;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: OrderStatus; //order prodcessing status
    paymentStatus: 'pending' | 'paid'; // payment status
};