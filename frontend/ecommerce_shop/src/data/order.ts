import type { Order } from '../models/Order';

const KEY = 'plushie-orders';

// fake bank account info for bank transfer payment
export const BANK_ACCOUNT = {
    bank: 'Vietcombank',
    accountName: 'PLUSHIE KAT CO., LTD',
    accountNumber: '0123 456 789',
};

export const newOrderId = () => `PL-${Date.now().toString(36).toUpperCase()}`;

export function loadOrders(): Order[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
        return [];
    }
}

export async function placeOrder(order: Order): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const saved: Order = { ...order, status: order.paymentMethod === 'mock' ? 'paid' : 'pending' };
    try {
        localStorage.setItem(KEY, JSON.stringify([saved, ...loadOrders()]));
    } catch {
        /* bỏ qua */
    }
    return saved;
}