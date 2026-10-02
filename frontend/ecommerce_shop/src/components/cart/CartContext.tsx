import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../../models/Product';
import type { CartItem } from '../../models/Cart';

export const FREE_SHIPPING_MIN = 0;
export const SHIPPING_FEE = 0;

const STORAGE_KEY = 'plushie-cart';

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;


type CartProduct = Product & { originalPrice?: number; images?: string[] };
type AddOptions = { color?: string; size?: string; quantity?: number };

type CartContextValue = {
    items: CartItem[];
    count: number;
    subtotal: number;
    shipping: number;
    total: number;
    isOpen: boolean;
    addItem: (product: CartProduct, options?: AddOptions) => void;
    updateQuantity: (key: string, quantity: number) => void;
    removeItem: (key: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadItems(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadItems);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* skip if storage is unavailable */
        }
    }, [items]);

    const addItem = useCallback<CartContextValue['addItem']>((product, { color, size, quantity = 1 } = {}) => {
        const key = [product.id, color ?? '', size ?? ''].join('|');
        const max = Math.min(Math.max(1, product.stockQuantity ?? 99), 99);

        setItems((prev) => {
            if (prev.some((i) => i.key === key)) {
                return prev.map((i) =>
                    i.key === key ? { ...i, quantity: Math.min(i.maxQuantity, i.quantity + quantity) } : i,
                );
            }
            return [
                ...prev,
                {
                    key,
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    originalPrice: product.originalPrice,
                    imageUrl: product.imageUrl ?? product.images?.[0] ?? null,
                    color,
                    size,
                    quantity: Math.min(max, quantity),
                    maxQuantity: max,
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((key: string, quantity: number) => {
        setItems((prev) =>
            prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.maxQuantity, Math.max(1, quantity)) } : i)),
        );
    }, []);

    const removeItem = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
    const clearCart = useCallback(() => setItems([]), []);
    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const value = useMemo<CartContextValue>(() => {
        const count = items.reduce((s, i) => s + i.quantity, 0);
        const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0));
        const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
        return {
            items, count, subtotal, shipping, total: round2(subtotal + shipping), isOpen,
            addItem, updateQuantity, removeItem, clearCart, openCart, closeCart,
        };
    }, [items, isOpen, addItem, updateQuantity, removeItem, clearCart, openCart, closeCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
}