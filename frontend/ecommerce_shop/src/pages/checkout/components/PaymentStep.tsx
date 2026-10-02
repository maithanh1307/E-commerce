import { ArrowRight, Banknote, CreditCard, Landmark } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PaymentMethod } from '../../../models/Order';
import { BANK_ACCOUNT } from '../../../data/order';


const OPTIONS: { key: PaymentMethod; icon: LucideIcon; title: string; text: string; tag?: string }[] = [
    { key: 'cod', icon: Banknote, title: 'Cash on Delivery', text: 'Pay in cash when your order arrives.' },
    { key: 'bank', icon: Landmark, title: 'Bank Transfer', text: 'Transfer to our bank account after placing your order.' },
    { key: 'mock', icon: CreditCard, title: 'Mock Payment', text: 'Simulated payment for testing. No real charge is made.', tag: 'Test' },
];

type Props = {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
    onBack: () => void;
    onContinue: () => void;
};

export default function PaymentStep({ value, onChange, onBack, onContinue }: Props) {
    return (
        <section aria-labelledby="step-title">
            <h2 id="step-title" className="co-h">Payment Method</h2>

            <div className="co-choices" role="radiogroup" aria-label="Payment method">
                {OPTIONS.map(({ key, icon: Icon, title, text, tag }) => (
                    <div key={key} className={`co-choice ${key === value ? 'is-selected' : ''}`}>
                        <label className="co-choice__main">
                            <input type="radio" name="payment" checked={key === value} onChange={() => onChange(key)} />
                            <span className="co-choice__dot" aria-hidden />
                            <span className="co-choice__icon" aria-hidden><Icon size={20} /></span>
                            <span className="co-choice__text">
                                <strong>
                                    {title}
                                    {tag && <span className="co-tag">{tag}</span>}
                                </strong>
                                <span>{text}</span>
                            </span>
                        </label>

                        {key === 'bank' && value === 'bank' && (
                            <div className="co-note">
                                <dl>
                                    <div><dt>Bank</dt><dd>{BANK_ACCOUNT.bank}</dd></div>
                                    <div><dt>Account name</dt><dd>{BANK_ACCOUNT.accountName}</dd></div>
                                    <div><dt>Account number</dt><dd>{BANK_ACCOUNT.accountNumber}</dd></div>
                                </dl>
                                <p>Use your order code as the transfer note. You’ll get the code after placing your order.</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="co-actions">
                <button type="button" className="co-btn co-btn--ghost" onClick={onBack}>Back</button>
                <button type="button" className="co-btn" onClick={onContinue}>
                    Continue to Confirmation <ArrowRight size={18} aria-hidden />
                </button>
            </div>
        </section>
    );
}