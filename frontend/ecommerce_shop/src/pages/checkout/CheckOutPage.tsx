import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, PawPrint } from 'lucide-react';

import Header from '../../components/header/Header';
import { formatPrice, useCart } from '../../components/cart/CartContext';
import type { Address, Order, PaymentMethod } from '../../models/Order';
import { loadAddresses, saveAddresses } from '../../data/Address';
import type { Coupon } from '../../models/Coupon';
import { couponDiscount, findCoupon } from '../../data/coupon';
import { BANK_ACCOUNT, newOrderId, placeOrder } from '../../data/order';
import ShippingStep from './components/ShippingStep';
import PaymentStep from './components/PaymentStep';
import ConfirmStep from './components/ConfirmStep';

import './css/CheckOutPage.css';


type Step = 'shipping' | 'payment' | 'confirm';

const STEPS: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirmation' },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

export default function CheckoutPage() {
    const { items, subtotal, shipping, clearCart } = useCart();

    const [step, setStep] = useState<Step>('shipping');
    const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
    const [addressId, setAddressId] = useState<string | null>(() => addresses[0]?.id ?? null);
    const [payment, setPayment] = useState<PaymentMethod>('cod');
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => { saveAddresses(addresses); }, [addresses]);
    useEffect(() => { window.scrollTo({ top: 0 }); }, [step, order]);

    const address = addresses.find((a) => a.id === addressId) ?? null;
    const discount = coupon ? couponDiscount(coupon, subtotal) : 0;
    const total = round2(subtotal - discount + shipping);
    const stepIndex = STEPS.findIndex((s) => s.key === step);

    const saveAddress = (values: Omit<Address, 'id'>, id?: string) => {
        const saved: Address = { ...values, id: id ?? `addr-${Date.now()}` };
        setAddresses((list) => (id ? list.map((a) => (a.id === id ? saved : a)) : [...list, saved]));
        setAddressId(saved.id);
    };

    const applyCoupon = (code: string) => {
        const result = findCoupon(code, subtotal);
        if (result.error) return result.error;
        setCoupon(result.coupon!);
        return null;
    };

    const place = async () => {
        if (!address) return;
        setPlacing(true);
        setError('');
        try {
            const placed = await placeOrder({
                id: newOrderId(),
                createdAt: new Date().toISOString(),
                items: items.map(({ productId, name, price, quantity, color, size, imageUrl }) => ({
                    productId, name, price, quantity, color, size, imageUrl,
                })),
                address,
                paymentMethod: payment,
                couponCode: coupon?.code,
                subtotal, discount, shipping, total,
                status: 'pending',
            });
            setOrder(placed);
            clearCart();
        } catch {
            setError('We couldn’t place your order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    // order placed successfully
    if (order) {
        return (
            <>
                <Header active="Cart" />
                <main className="co-page">
                    <div className="co-card co-success">
                        <span className="co-success__icon"><Check size={32} aria-hidden /></span>
                        <h1>Thank you for your order!</h1>
                        <p>Order code <strong>{order.id}</strong></p>

                        <div className="co-note">
                            {order.paymentMethod === 'cod' && (
                                <p>Please prepare <strong>{formatPrice(order.total)}</strong> in cash when your order arrives.</p>
                            )}
                            {order.paymentMethod === 'bank' && (
                                <>
                                    <p>Transfer <strong>{formatPrice(order.total)}</strong> to:</p>
                                    <dl>
                                        <div><dt>Bank</dt><dd>{BANK_ACCOUNT.bank}</dd></div>
                                        <div><dt>Account name</dt><dd>{BANK_ACCOUNT.accountName}</dd></div>
                                        <div><dt>Account number</dt><dd>{BANK_ACCOUNT.accountNumber}</dd></div>
                                        <div><dt>Transfer note</dt><dd>{order.id}</dd></div>
                                    </dl>
                                </>
                            )}
                            {order.paymentMethod === 'mock' && (
                                <p>Test payment of <strong>{formatPrice(order.total)}</strong> was successful. No real charge was made.</p>
                            )}
                        </div>

                        <div className="co-actions">
                            <Link to="/products" className="co-btn co-btn--ghost">Continue Shopping</Link>
                            <Link to="/orders" className="co-btn">View Order History</Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    // empty cart
    if (items.length === 0) {
        return (
            <>
                <Header active="Cart" />
                <main className="co-page">
                    <div className="co-card co-success">
                        <PawPrint size={48} strokeWidth={1.3} aria-hidden />
                        <h1>Your cart is empty</h1>
                        <p>Add a plushie to your cart before checking out.</p>
                        <div className="co-actions">
                            <Link to="/products" className="co-btn">Start shopping</Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header active="Cart" />

            <main className="co-page">
                <div className="co-card">
                    <h1 className="co-title">Checkout</h1>

                    <ol className="co-steps" aria-label="Checkout progress">
                        {STEPS.map((s, i) => {
                            const state = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'todo';
                            return (
                                <li key={s.key} className={`co-step is-${state}`} aria-current={state === 'active' ? 'step' : undefined}>
                                    <button type="button" disabled={state !== 'done' || placing} onClick={() => setStep(s.key)}>
                                        <span className="co-step__dot">{state === 'done' ? <Check size={12} aria-hidden /> : i + 1}</span>
                                        {s.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>

                    {step === 'shipping' && (
                        <ShippingStep
                            addresses={addresses}
                            selectedId={addressId}
                            onSelect={setAddressId}
                            onSave={saveAddress}
                            onContinue={() => setStep('payment')}
                        />
                    )}

                    {step === 'payment' && (
                        <PaymentStep
                            value={payment}
                            onChange={setPayment}
                            onBack={() => setStep('shipping')}
                            onContinue={() => setStep('confirm')}
                        />
                    )}

                    {step === 'confirm' && address && (
                        <ConfirmStep
                            items={items}
                            address={address}
                            payment={payment}
                            coupon={coupon}
                            subtotal={subtotal}
                            discount={discount}
                            shipping={shipping}
                            total={total}
                            placing={placing}
                            error={error}
                            onApplyCoupon={applyCoupon}
                            onRemoveCoupon={() => setCoupon(null)}
                            onEdit={setStep}
                            onBack={() => setStep('payment')}
                            onPlace={place}
                        />
                    )}
                </div>
            </main>
        </>
    );
}