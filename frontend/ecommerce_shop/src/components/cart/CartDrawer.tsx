import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, ShoppingBag, X } from 'lucide-react';

import './CartDrawer.css';
import { formatPrice, useCart } from './CartContext';
import QuantityStepper from '../quantityStepper/QuantityStepper';

export default function CartDrawer() {
    const { items, count, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
    const panelRef = useRef<HTMLElement>(null);
    const { pathname } = useLocation();

    // close when route changes
    useEffect(() => { closeCart(); }, [pathname, closeCart]);

    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
        window.addEventListener('keydown', onKey);
        panelRef.current?.focus();
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, closeCart]);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'is-open' : ''}`} onClick={closeCart} aria-hidden />

            <aside
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
            >
                <header className="cart-drawer__head">
                    <h2 id="cart-drawer-title">Your Cart ({count})</h2>
                    <button type="button" aria-label="Close cart" onClick={closeCart}><X size={20} /></button>
                </header>

                {items.length === 0 ? (
                    <div className="cart-drawer__empty">
                        <ShoppingBag size={48} strokeWidth={1.3} aria-hidden />
                        <p>Your cart is empty</p>
                        <Link to="/products" className="cart-drawer__btn cart-drawer__btn--primary">Start shopping</Link>
                    </div>
                ) : (
                    <>
                        <ul className="cart-drawer__list">
                            {items.map((item) => (
                                <li key={item.key} className="drawer-item">
                                    <Link to={`/products/${item.productId}`} className="drawer-item__thumb" aria-label={item.name}>
                                        {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <PawPrint size={28} aria-hidden />}
                                    </Link>

                                    <div className="drawer-item__info">
                                        <Link to={`/products/${item.productId}`} className="drawer-item__name">{item.name}</Link>
                                        {(item.color || item.size) && (
                                            <small>{[item.color, item.size].filter(Boolean).join(' • ')}</small>
                                        )}
                                        <QuantityStepper
                                            small
                                            label={item.name}
                                            value={item.quantity}
                                            max={item.maxQuantity}
                                            onChange={(q) => updateQuantity(item.key, q)}
                                        />
                                    </div>

                                    <div className="drawer-item__side">
                                        <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.key)}>
                                            <X size={16} />
                                        </button>
                                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <footer className="cart-drawer__foot">
                            <div className="cart-drawer__subtotal">
                                <span>Subtotal</span>
                                <strong>{formatPrice(subtotal)}</strong>
                            </div>
                            <Link to="/checkout" className="cart-drawer__btn cart-drawer__btn--primary">Checkout</Link>
                            <Link to="/cart" className="cart-drawer__btn cart-drawer__btn--soft">View Cart</Link>
                        </footer>
                    </>
                )}
            </aside>
        </>
    );
}