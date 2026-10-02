import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PawPrint, ShieldCheck, ShoppingCart, X } from 'lucide-react';

import Header from '../../components/header/Header';
import './css/CartPage.css';
import { formatPrice, useCart } from '../../components/cart/CartContext';
import QuantityStepper from '../../components/quantityStepper/QuantityStepper';

export default function CartPage() {
    const { items, count, subtotal, shipping, total, updateQuantity, removeItem } = useCart();

    return (
        <>
            <Header active="Cart" />

            <main className="cart-page">
                <h1 className="cart-title">
                    <ShoppingCart size={34} aria-hidden /> Your Cart ({count})
                </h1>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <PawPrint size={56} strokeWidth={1.3} aria-hidden />
                        <h2>Your cart is empty</h2>
                        <p>Find a plushie to hug and add it here.</p>
                        <Link to="/products" className="cart-btn">Start shopping</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div>
                            <div className="cart-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope="col">Product</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                            <th scope="col"><span className="sr-only">Remove</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.key} className="cart-row">
                                                <td className="cart-cell cart-cell--prod">
                                                    <Link to={`/products/${item.productId}`} className="cart-thumb" aria-hidden tabIndex={-1}>
                                                        {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <PawPrint size={32} />}
                                                    </Link>
                                                    <div>
                                                        <Link to={`/products/${item.productId}`} className="cart-name">{item.name}</Link>
                                                        {(item.color || item.size) && (
                                                            <small>{[item.color, item.size].filter(Boolean).join(' • ')}</small>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="cart-cell cart-cell--price">
                                                    {formatPrice(item.price)}
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <s>{formatPrice(item.originalPrice)}</s>
                                                    )}
                                                </td>

                                                <td className="cart-cell cart-cell--qty">
                                                    <QuantityStepper
                                                        label={item.name}
                                                        value={item.quantity}
                                                        max={item.maxQuantity}
                                                        onChange={(q) => updateQuantity(item.key, q)}
                                                    />
                                                </td>

                                                <td className="cart-cell cart-cell--total">{formatPrice(item.price * item.quantity)}</td>

                                                <td className="cart-cell cart-cell--remove">
                                                    <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.key)}>
                                                        <X size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Link to="/products" className="cart-continue">
                                <ArrowLeft size={18} aria-hidden /> Continue Shopping
                            </Link>
                        </div>

                        <aside className="cart-summary" aria-labelledby="summary-title">
                            <h2 id="summary-title">Order Summary</h2>

                            <dl>
                                <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                                <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
                                <div className="cart-summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
                            </dl>

                            <Link to="/checkout" className="cart-btn cart-btn--block">
                                Proceed to Checkout <ArrowRight size={18} aria-hidden />
                            </Link>

                            <div className="cart-secure">
                                <ShieldCheck size={26} aria-hidden />
                                <span>
                                    <strong>Secure checkout</strong>
                                    <small>Your information is safe with us.</small>
                                </span>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </>
    );
}