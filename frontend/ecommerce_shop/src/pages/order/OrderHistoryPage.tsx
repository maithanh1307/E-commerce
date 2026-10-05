import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, PawPrint } from 'lucide-react';

import Header from '../../components/header/Header';
import { PAYMENT_LABELS, STATUS_LABELS, type Order, type OrderStatus } from '../../models/Order';
import { loadOrders, SAMPLE_ORDERS } from '../../data/order';
import { formatPrice } from '../../components/cart/CartContext';
import { formatAddress } from '../../data/Address';

import './css/OrderHistoryPage.css';

type Filter = 'all' | OrderStatus;

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'processing', label: STATUS_LABELS.processing },
    { key: 'shipped', label: STATUS_LABELS.shipped },
    { key: 'delivered', label: STATUS_LABELS.delivered },
    { key: 'cancelled', label: STATUS_LABELS.cancelled },
];

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function OrderHistoryPage() {
    // use real data from localstorage
    const [orders] = useState<Order[]>(() => {
        const real = loadOrders();
        return real.length > 0 ? real : SAMPLE_ORDERS;
    });
    const [filter, setFilter] = useState<Filter>('all');

    const visible = useMemo(
        () =>
            orders
                .filter((o) => filter === 'all' || o.status === filter)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        [orders, filter],
    );

    return (
        <>
            <Header active="Order History" />

            <main className="oh-page">
                <h1 className="oh-title">
                    <ClipboardList size={30} aria-hidden /> Order History
                </h1>

                <div className="oh-filters" role="group" aria-label="Filter orders by status">
                    {FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={key === filter ? 'is-active' : ''}
                            aria-pressed={key === filter}
                            onClick={() => setFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {orders.length === 0 ? (
                    <div className="oh-empty">
                        <PawPrint size={52} strokeWidth={1.3} aria-hidden />
                        <h2>No orders yet</h2>
                        <p>When you place an order, it will show up here.</p>
                        <Link to="/products" className="oh-btn oh-btn--primary">Start shopping</Link>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="oh-empty">
                        <h2>No {filter === 'all' ? '' : STATUS_LABELS[filter].toLowerCase() + ' '}orders</h2>
                        <button type="button" className="oh-btn" onClick={() => setFilter('all')}>Show all orders</button>
                    </div>
                ) : (
                    <ul className="oh-list">
                        {visible.map((o) => <OrderRow key={o.id} order={o} />)}
                    </ul>
                )}
            </main>
        </>
    );
}

function Thumb({ src, size = 'md' }: { src: string | null; size?: 'md' | 'sm' }) {
    return (
        <span className={`oh-thumb oh-thumb--${size}`}>
            {src ? <img src={src} alt="" /> : <PawPrint size={size === 'md' ? 24 : 20} aria-hidden />}
        </span>
    );
}

function OrderRow({ order }: { order: Order }) {
    const [open, setOpen] = useState(false);
    const count = order.items.reduce((s, i) => s + i.quantity, 0);
    const shown = order.items.slice(0, 3);
    const extra = order.items.length - shown.length;
    const detailId = `oh-detail-${order.id}`;

    const paymentNote =
        order.paymentStatus === 'paid' ? 'Paid' : order.paymentMethod === 'cod' ? 'Pay on delivery' : 'Awaiting payment';

    return (
        <li className="oh-card">
            <div className="oh-row">
                <div className="oh-id">
                    <strong>#{order.id}</strong>
                    <span aria-hidden>·</span>
                    <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                </div>

                <div className="oh-items">
                    <div className="oh-thumbs" aria-hidden>
                        {shown.map((i, idx) => <Thumb key={`${i.productId}-${idx}`} src={i.imageUrl} />)}
                        {extra > 0 && <span className="oh-thumb oh-thumb--more">+{extra}</span>}
                    </div>
                    <span className="oh-count">{count} {count === 1 ? 'item' : 'items'}</span>
                </div>

                <span className={`oh-status is-${order.status}`}>{STATUS_LABELS[order.status]}</span>

                <span className="oh-total">Total: <strong>{formatPrice(order.total)}</strong></span>

                <button
                    type="button"
                    className="oh-btn oh-action"
                    aria-expanded={open}
                    aria-controls={detailId}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? 'Hide Details' : 'View Details'}
                </button>
            </div>

            {open && (
                <div id={detailId} className="oh-detail">
                    <ul className="oh-lines">
                        {order.items.map((i, idx) => (
                            <li key={`${i.productId}-${idx}`}>
                                <Thumb src={i.imageUrl} size="sm" />
                                <span>
                                    <Link to={`/products/${i.productId}`}>{i.name}</Link>
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

                    <div className="oh-detail__grid">
                        <div className="oh-box">
                            <h3>Shipping to</h3>
                            <p>
                                <strong>{order.address.fullName}</strong>
                                {formatAddress(order.address)}
                                <br />
                                {order.address.phone}
                            </p>
                        </div>

                        <div className="oh-box">
                            <h3>Payment</h3>
                            <p>
                                <strong>{PAYMENT_LABELS[order.paymentMethod]}</strong>
                                {paymentNote}
                            </p>
                        </div>

                        <div className="oh-box">
                            <h3>Summary</h3>
                            <dl>
                                <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
                                {order.discount > 0 && (
                                    <div className="is-discount">
                                        <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt>
                                        <dd>-{formatPrice(order.discount)}</dd>
                                    </div>
                                )}
                                <div><dt>Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
                                <div className="oh-sum-total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}