import { Link } from 'react-router-dom';
import { CreditCard, Settings } from 'lucide-react';

export function PaymentMethodsSection() {
    return (
        <section className="ac-card" aria-labelledby="pay-title">
            <div className="ac-card__head"><h1 id="pay-title">Payment Methods</h1></div>
            <div className="ac-empty">
                <CreditCard size={44} strokeWidth={1.3} aria-hidden />
                <p>
                    Saved payment methods aren’t available yet. At checkout you can pay with
                    Cash on Delivery, Bank Transfer or Mock Payment.
                </p>
                <Link to="/products" className="ac-btn">Keep shopping</Link>
            </div>
        </section>
    );
}

export function SettingsSection() {
    return (
        <section className="ac-card" aria-labelledby="settings-title">
            <div className="ac-card__head"><h1 id="settings-title">Settings</h1></div>
            <div className="ac-empty">
                <Settings size={44} strokeWidth={1.3} aria-hidden />
                <p>There’s nothing to configure yet. Account settings will appear here.</p>
            </div>
        </section>
    );
}