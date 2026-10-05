export type Profile = {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string; 
    avatarUrl?: string;
};

const KEY = 'plushie-profile';

export const DEFAULT_PROFILE: Profile = {
    fullName: 'Nguyễn Thanh Mai',
    email: 'maithanh@gmail.com',
    phone: '+84 987 654 321',
    dateOfBirth: '2003-01-01',
};

export function loadProfile(): Profile {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<Profile>) } : DEFAULT_PROFILE;
    } catch {
        return DEFAULT_PROFILE;
    }
}

export function saveProfile(profile: Profile) {
    try {
        localStorage.setItem(KEY, JSON.stringify(profile));
    } catch {
        /* bỏ qua nếu storage bị chặn */
    }
}

export const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (first + last).toUpperCase();
};

export const formatBirthday = (iso?: string) =>
    iso
        ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';