import type { Coupon } from "../models/Coupon";

const COUPONS: Coupon[] = [
    { code: 'PLUSH10', label: '10% off your order', type: 'percent', value: 10 },
    { code: 'SAVE5', label: '$5 off orders over $20', type: 'fixed', value: 5, minSubtotal: 20 },
];

export function findCoupon(input: string, subtotal: number): { coupon?: Coupon; error?: string } {
    const coupon = COUPONS.find((c) => c.code === input.trim().toUpperCase());
    if (!coupon) return { error: 'This coupon code is not valid.' };
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
        return { error: `Spend at least $${coupon.minSubtotal} to use this coupon.` };
    }
    return { coupon };
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
    const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
    return Math.round(Math.min(raw, subtotal) * 100) / 100;
}