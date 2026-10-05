import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import type { Address } from '../../../models/Order';
import { formatAddress, isValidPhone } from '../../../data/Address';


type FormValues = Omit<Address, 'id'>;
type Errors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { fullName: '', phone: '', street: '', ward: '', district: '', city: '' };

type Props = {
    addresses: Address[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onSave: (values: FormValues, id?: string) => void;
    onContinue: () => void;
};

export default function ShippingStep({ addresses, selectedId, onSelect, onSave, onContinue }: Props) {
    const [editing, setEditing] = useState<Address | 'new' | null>(null);
    const showForm = addresses.length === 0 || editing !== null;
    const editingAddress = editing && editing !== 'new' ? editing : undefined;

    return (
        <section aria-labelledby="step-title">
            <h2 id="step-title" className="co-h">Shipping Address</h2>

            {showForm ? (
                <AddressForm
                    key={editingAddress?.id ?? 'new'}
                    initial={editingAddress ?? EMPTY}
                    onCancel={addresses.length > 0 ? () => setEditing(null) : undefined}
                    onSubmit={(values) => {
                        onSave(values, editingAddress?.id);
                        setEditing(null);
                    }}
                />
            ) : (
                <>
                    <div className="co-choices" role="radiogroup" aria-label="Saved addresses">
                        {addresses.map((a) => (
                            <div
                                key={a.id}
                                className={`co-choice co-choice--addr ${a.id === selectedId ? 'is-selected' : ''}`}
                            >
                                <label className="co-choice__main">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={a.id === selectedId}
                                        onChange={() => onSelect(a.id)}
                                    />
                                    <span className="co-choice__dot" aria-hidden />
                                    <span className="co-choice__text">
                                        <strong>{a.fullName}</strong>
                                        <span>{formatAddress(a)}</span>
                                        <span>{a.phone}</span>
                                    </span>
                                </label>
                                <button type="button" className="co-choice__change" onClick={() => setEditing(a)}>
                                    Change
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="button" className="co-add" onClick={() => setEditing('new')}>
                        <Plus size={16} aria-hidden /> Add a new address
                    </button>

                    <div className="co-actions">
                        <button type="button" className="co-btn" disabled={!selectedId} onClick={onContinue}>
                            Continue to Payment <ArrowRight size={18} aria-hidden />
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

function AddressForm({
    initial,
    onSubmit,
    onCancel,
}: {
    initial: FormValues;
    onSubmit: (values: FormValues) => void;
    onCancel?: () => void;
}) {
    const [values, setValues] = useState<FormValues>(initial);
    const [errors, setErrors] = useState<Errors>({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const next: Errors = {};
        if (!values.fullName.trim()) next.fullName = 'Enter the recipient’s full name.';
        if (!isValidPhone(values.phone)) next.phone = 'Enter a valid phone number, e.g. 0987 654 321.';
        if (!values.street.trim()) next.street = 'Enter your house number and street.';
        if (!values.district.trim()) next.district = 'Enter your district.';
        if (!values.city.trim()) next.city = 'Enter your city or province.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        onSubmit({
            fullName: values.fullName.trim(),
            phone: values.phone.trim(),
            street: values.street.trim(),
            ward: values.ward?.trim() || undefined,
            district: values.district.trim(),
            city: values.city.trim(),
        });
    };

    const field = (key: keyof FormValues, label: string, autoComplete: string, span: string) => (
        <label className={`co-field ${span}`}>
            <span>{label}</span>
            <input
                value={values[key] ?? ''}
                autoComplete={autoComplete}
                aria-invalid={Boolean(errors[key])}
                onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
            {errors[key] && <small role="alert">{errors[key]}</small>}
        </label>
    );

    return (
        <form className="co-form" onSubmit={submit} noValidate>
            {field('fullName', 'Full name', 'name', 'span-3')}
            {field('phone', 'Phone number', 'tel', 'span-3')}
            {field('street', 'House number and street', 'address-line1', 'span-6')}
            {field('ward', 'Ward (optional)', 'address-line2', 'span-2')}
            {field('district', 'District', 'address-level2', 'span-2')}
            {field('city', 'City / Province', 'address-level1', 'span-2')}

            <div className="co-actions span-6">
                {onCancel && (
                    <button type="button" className="co-btn co-btn--ghost" onClick={onCancel}>Cancel</button>
                )}
                <button type="submit" className="co-btn">
                    Save address
                </button>
            </div>
        </form>
    );
}