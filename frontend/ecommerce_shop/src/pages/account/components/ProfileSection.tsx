import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CreditCard, MapPin, Pencil } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAccount } from '../AccountPage';
import { formatBirthday, type Profile } from '../../../models/Profile';
import { isValidPhone } from '../../../data/Address';
import bannerBear  from '../../../assets/account_image.jpg';


const QUICK_LINKS: { to: string; icon: LucideIcon; title: string; text: string; tone: string }[] = [
    { to: '/orders', icon: ClipboardList, title: 'My Orders', text: 'View your order history', tone: 'orange' },
    { to: '/account/addresses', icon: MapPin, title: 'My Addresses', text: 'Manage delivery addresses', tone: 'blue' },
    { to: '/account/payment', icon: CreditCard, title: 'Payment Methods', text: 'Manage payment methods', tone: 'purple' },
];

export default function ProfileSection() {
    const { profile, updateProfile } = useAccount();
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
        <>
            <div className="ac-top">
                <section className="ac-card" aria-labelledby="profile-title">
                    <div className="ac-card__head">
                        <h1 id="profile-title">Profile Information</h1>
                        {!editing && (
                            <button type="button" className="ac-edit" onClick={() => { setEditing(true); setSaved(false); }}>
                                <Pencil size={16} aria-hidden /> Edit
                            </button>
                        )}
                    </div>

                    {saved && !editing && <p className="ac-saved" role="status">Your profile has been updated.</p>}

                    {editing ? (
                        <ProfileForm
                            initial={profile}
                            onCancel={() => setEditing(false)}
                            onSave={(next) => {
                                updateProfile(next);
                                setEditing(false);
                                setSaved(true);
                            }}
                        />
                    ) : (
                        <dl className="ac-fields">
                            <div><dt>Full Name</dt><dd>{profile.fullName}</dd></div>
                            <div><dt>Email</dt><dd>{profile.email}</dd></div>
                            <div><dt>Phone</dt><dd>{profile.phone}</dd></div>
                            <div><dt>Date of Birth</dt><dd>{formatBirthday(profile.dateOfBirth)}</dd></div>
                        </dl>
                    )}
                </section>

                <Link to="/products" className="ac-banner">
                    <img
                        src={bannerBear}
                        alt=""
                        className="ac-banner__art"
                    />
                </Link>
            </div>

            <section className="ac-quick" aria-labelledby="quick-title">
                <h2 id="quick-title">Quick Links</h2>
                <div className="ac-quick__grid">
                    {QUICK_LINKS.map(({ to, icon: Icon, title, text, tone }) => (
                        <Link key={to} to={to} className="ac-quick__item">
                            <span className={`ac-quick__icon is-${tone}`}><Icon size={22} aria-hidden /></span>
                            <span>
                                <strong>{title}</strong>
                                <small>{text}</small>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}

// update profile form
type Errors = Partial<Record<keyof Profile, string>>;

function ProfileForm({
    initial,
    onSave,
    onCancel,
}: {
    initial: Profile;
    onSave: (next: Profile) => void;
    onCancel: () => void;
}) {
    const [values, setValues] = useState<Profile>(initial);
    const [errors, setErrors] = useState<Errors>({});
    const today = new Date().toISOString().slice(0, 10);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const next: Errors = {};
        if (!values.fullName.trim()) next.fullName = 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid email address.';
        if (!isValidPhone(values.phone)) next.phone = 'Enter a valid phone number, e.g. 0987 654 321.';
        if (values.dateOfBirth && values.dateOfBirth >= today) next.dateOfBirth = 'Date of birth must be in the past.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        onSave({
            ...values,
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            dateOfBirth: values.dateOfBirth || undefined,
        });
    };

    const field = (key: 'fullName' | 'email' | 'phone' | 'dateOfBirth', label: string, type: string, autoComplete: string) => (
        <label className="ac-field">
            <span>{label}</span>
            <input
                type={type}
                value={values[key] ?? ''}
                max={key === 'dateOfBirth' ? today : undefined}
                autoComplete={autoComplete}
                aria-invalid={Boolean(errors[key])}
                onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
            {errors[key] && <small role="alert">{errors[key]}</small>}
        </label>
    );

    return (
        <form className="ac-form" onSubmit={submit} noValidate>
            {field('fullName', 'Full Name', 'text', 'name')}
            {field('email', 'Email', 'email', 'email')}
            {field('phone', 'Phone', 'tel', 'tel')}
            {field('dateOfBirth', 'Date of Birth', 'date', 'bday')}

            <div className="ac-actions">
                <button type="button" className="ac-btn ac-btn--ghost" onClick={onCancel}>Cancel</button>
                <button type="submit" className="ac-btn">Save changes</button>
            </div>
        </form>
    );
}
