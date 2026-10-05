import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { CreditCard, LogOut, MapPin, Settings, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import Header from '../../components/header/Header';
import { getInitials, loadProfile, saveProfile, type Profile } from '../../models/Profile';
import './css/AccountPage.css';

export type AccountContext = {
    profile: Profile;
    updateProfile: (next: Profile) => void;
};

// use hook to access account context in child components
export const useAccount = () => useOutletContext<AccountContext>();

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
    { to: '/account', label: 'Profile', icon: User, end: true },
    { to: '/account/addresses', label: 'Addresses', icon: MapPin },
    { to: '/account/payment', label: 'Payment Methods', icon: CreditCard },
];

export default function AccountLayout() {
    const [profile, setProfile] = useState<Profile>(loadProfile);
    const navigate = useNavigate();

    const updateProfile = (next: Profile) => {
        setProfile(next);
        saveProfile(next);
    };

    const logout = () => {
        // TODO: call api
        navigate('/');
    };

    const context: AccountContext = { profile, updateProfile };

    return (
        <>
            <Header active="Account" avatar={profile.avatarUrl} />

            <main className="ac-page">
                <aside className="ac-side">
                    <div className="ac-user">
                        <span className="ac-avatar">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : getInitials(profile.fullName)}
                        </span>
                        <div>
                            <strong>{profile.fullName}</strong>
                            <small>{profile.email}</small>
                        </div>
                    </div>

                    <nav className="ac-nav" aria-label="Account sections">
                        {NAV.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) => `ac-nav__item ${isActive ? 'is-active' : ''}`}
                            >
                                <Icon size={20} aria-hidden /> {label}
                            </NavLink>
                        ))}
                        <button type="button" className="ac-nav__item" onClick={logout}>
                            <LogOut size={20} aria-hidden /> Log Out
                        </button>
                    </nav>
                </aside>

                <div className="ac-content">
                    <Outlet context={context} />
                </div>
            </main>
        </>
    );
}