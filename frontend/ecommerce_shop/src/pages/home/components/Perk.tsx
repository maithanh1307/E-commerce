import type { CSSProperties } from 'react';
import { Truck, ShieldCheck, Heart, Gift, Sparkles } from 'lucide-react';

const PERKS = [
    {
        icon: Truck,
        title: 'Free Shipping',
        text: 'For orders over $50',
        bg: '#e4e8ff', 
        accent: '#7b8cf0', 
        shadow: '#c3caf7', 
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payment',
        text: '100% safe & reliable',
        bg: '#eadffb',
        accent: '#9a7ae0',
        shadow: '#d3c0f3',
    },
    {
        icon: Heart,
        title: 'Easy Returns',
        text: 'Within 7 days',
        bg: '#ffdce8',
        accent: '#ff7aa8',
        shadow: '#ffbdd3',
    },
    {
        icon: Gift,
        title: 'Gift Wrapping',
        text: 'Make it extra special',
        bg: '#fff0c9',
        accent: '#ffa94d',
        shadow: '#ffdc94',
    },
];

export default function Perks() {
    return (
        <section className="perks" aria-label="Shop perks">
            {PERKS.map(({ icon: Icon, title, text, bg, accent, shadow }) => (
                <div
                    key={title}
                    className="perk"
                    style={
                        {
                            '--perk-bg': bg,
                            '--perk-accent': accent,
                            '--perk-shadow': shadow,
                        } as CSSProperties
                    }
                >
                    <Sparkles className="perk__sparkle" size={14} aria-hidden />

                    <span className="perk__icon">
                        <Icon size={26} strokeWidth={2.4} aria-hidden />
                    </span>

                    <div className="perk__body">
                        <strong>{title}</strong>
                        <small>{text}</small>
                    </div>
                </div>
            ))}
        </section>
    );
}