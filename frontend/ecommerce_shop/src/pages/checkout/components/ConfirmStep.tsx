import { useState } from 'react';
import { PawPrint, Tag, X } from 'lucide-react';
import type { CartItem } from '../../../models/Cart';
import { PAYMENT_LABELS, type Address, type PaymentMethod } from '../../../models/Order';
import type { Coupon } from '../../../models/Coupon';
import { formatPrice } from '../../../components/cart/CartContext';
import { formatAddress } from '../../../data/Address';


type Props = {
    items: CartItem[];
    address: Address;
    payment: PaymentMethod;
    coupon: Coupon | null;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    placing: boolean;
    error: string;
    onApplyCoupon: (code: string) => string | null; 
    onRemoveCoupon: () => void;
    onEdit: (step: 'shipping' | 'payment') => void;
    onBack: () => void;
    onPlace: () => void;
};

export default function ConfirmStep(p: Props) {
    const [code, setCode] = useState('');
    const [couponError, setCouponError] = useState('');

    const apply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return setCouponError('Enter a coupon code.');
        const err = p.onApplyCoupon(code);
        setCouponError(err ?? '');
        if (!err) setCode('');
    };

    return (
        <section aria-labelledby="step-title">
            <h2 id="step-title" className="co-h">Review your order</h2>

            <div className="co-confirm">
                {/* left side */}
                <div className="co-confirm__main">
                    <div className="co-box">
                        <h3>Items ({p.items.reduce((s, i) => s + i.quantity, 0)})</h3>
                        <ul className="co-items">
                            {p.items.map((i) => (
                                <li key={i.key}>
                                    <span className="co-items__thumb">
                                        {i.imageUrl ? <img src={i.imageUrl} alt="" /> : <PawPrint size={24} aria-hidden />}
                                    </span>
                                    <span>
                                        <strong>{i.name}</strong>
                                        <small>
                                            {[i.color, i.size].filter(Boolean).join(' • ')}
                                            {(i.color || i.size) && ' · '}
                                            {i.quantity} × {formatPrice(i.price)}
                                        </small>
                                    </span>
                                    <b>{formatPrice(i.price * i.quantity)}</b>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="co-info">
                        <div className="co-box">
                            <div className="co-box__head">
                                <h3>Shipping to</h3>
                                <button type="button" className="co-link" onClick={() => p.onEdit('shipping')}>Edit</button>
                            </div>
                            <p className="co-summary">
                                <strong>{p.address.fullName}</strong>
                                {formatAddress(p.address)}
                                <br />
                                {p.address.phone}
                            </p>
                        </div>

                        <div className="co-box">
                            <div className="co-box__head">
                                <h3>Payment method</h3>
                                <button type="button" className="co-link" onClick={() => p.onEdit('payment')}>Edit</button>
                            </div>
                            <p className="co-summary">{PAYMENT_LABELS[p.payment]}</p>
                        </div>
                    </div>
                </div>

                {/* right side: coupon + total + place order */}
                <aside className="co-confirm__side" aria-label="Order summary">
                    <h3>Order summary</h3>

                    <div className="co-coupon-wrap">
                        {p.coupon ? (
                            <div className="co-coupon-applied" role="status">
                                <span><Tag size={16} aria-hidden /> <strong>{p.coupon.code}</strong> · {p.coupon.label}</span>
                                <button type="button" aria-label="Remove coupon" onClick={p.onRemoveCoupon}><X size={16} /></button>
                            </div>
                        ) : (
                            <form className="co-coupon" onSubmit={apply}>
                                <input
                                    value={code}
                                    placeholder="Coupon code"
                                    aria-label="Coupon code"
                                    aria-invalid={Boolean(couponError)}
                                    onChange={(e) => { setCode(e.target.value); setCouponError(''); }}
                                />
                                <button type="submit" className="co-btn co-btn--soft">Apply</button>
                            </form>
                        )}
                        {couponError && <small className="co-error" role="alert">{couponError}</small>}
                    </div>

                    <dl className="co-totals">
                        <div><dt>Subtotal</dt><dd>{formatPrice(p.subtotal)}</dd></div>
                        {p.discount > 0 && <div className="is-discount"><dt>Discount</dt><dd>-{formatPrice(p.discount)}</dd></div>}
                        <div><dt>Shipping</dt><dd>{p.shipping === 0 ? 'Free' : formatPrice(p.shipping)}</dd></div>
                        <div className="co-totals__total"><dt>Total</dt><dd>{formatPrice(p.total)}</dd></div>
                    </dl>

                    {p.error && <p className="co-error" role="alert">{p.error}</p>}

                    <div className="co-actions">
                        <button type="button" className="co-btn co-btn--ghost" disabled={p.placing} onClick={p.onBack}>Back</button>
                        <button type="button" className="co-btn" disabled={p.placing} onClick={p.onPlace}>
                            {p.placing ? 'Placing order…' : 'Place Order'}
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    );
}