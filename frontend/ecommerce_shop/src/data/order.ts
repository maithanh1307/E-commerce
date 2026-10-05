import type { Address, Order, OrderItem, OrderStatus } from '../models/Order';

const KEY = 'plushie-orders';
const STATUSES: OrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled'];

// fake bank account info for bank transfer payment
export const BANK_ACCOUNT = {
    bank: 'Vietcombank',
    accountName: 'PLUSHIE KAT CO., LTD',
    accountNumber: '0123 456 789',
};

export const newOrderId = () => `PL-${Date.now().toString(36).toUpperCase()}`;

// normalize old data
function normalize(o: Order): Order {
    const legacy = o.status as string;
    return {
        ...o,
        status: STATUSES.includes(o.status) ? o.status : 'processing',
        paymentStatus: o.paymentStatus ?? (legacy === 'paid' ? 'paid' : 'pending'),
    };
}

export function loadOrders(): Order[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Order[]).map(normalize) : [];
    } catch {
        return [];
    }
}

export async function placeOrder(order: Order): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const saved: Order = {
        ...order,
        status: 'processing',
        paymentStatus: order.paymentMethod === 'mock' ? 'paid' : 'pending',
    };
    try {
        localStorage.setItem(KEY, JSON.stringify([saved, ...loadOrders()]));
    } catch {
        /* bỏ qua */
    }
    return saved;
}

// fake data
const sampleAddress: Address = {
    id: 'sample',
    fullName: 'Mai Thanh',
    phone: '+84 987 654 321',
    street: 'Số 123, Đường ABC',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
};

const line = (productId: number, name: string, price: number, color?: string, size?: string): OrderItem => ({
    productId, name, price, quantity: 1, color, size, imageUrl: null,
});

function sample(id: string, date: string, status: OrderStatus, items: OrderItem[]): Order {
    const subtotal = Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
    return {
        id,
        createdAt: `${date}T12:00:00`,
        items,
        address: sampleAddress,
        paymentMethod: 'cod',
        subtotal,
        discount: 0,
        shipping: 0,
        total: subtotal,
        status,
        paymentStatus: status === 'delivered' ? 'paid' : 'pending',
    };
}

export const SAMPLE_ORDERS: Order[] = [
    sample('ORD-20250928', '2025-09-28', 'delivered', [line(1, 'Teddy Bear', 15.99, 'Brown', '25cm'), line(2, 'Bunny with Carrot', 12.99, 'White', '20cm')]),
    sample('ORD-20250920', '2025-09-20', 'shipped', [line(3, 'Penguin Plush', 14.99, 'Grey', '22cm')]),
    sample('ORD-20250912', '2025-09-12', 'processing', [line(6, 'Panda Bear', 14.99), line(4, 'Kitty Plush', 12.99)]),
    sample('ORD-20250830', '2025-08-30', 'delivered', [line(5, 'Dinosaur Plush', 16.99)]),
    sample('ORD-20250815', '2025-08-15', 'cancelled', [line(8, 'Corgi Plush', 13.99)]),
];