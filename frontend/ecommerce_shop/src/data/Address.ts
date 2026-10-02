import type { Address } from '../models/Order';

const KEY = 'plushie-addresses';

export function loadAddresses(): Address[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Address[]) : [];
    } catch {
        return [];
    }
}

export function saveAddresses(list: Address[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
        /* skip if storage is blocked */
    }
}

export const formatAddress = (a: Address) => [a.street, a.ward, a.district, a.city].filter(Boolean).join(', ');

export const isValidPhone = (p: string) => /^(\+84|0)\d{9,10}$/.test(p.replace(/[\s.-]/g, ''));