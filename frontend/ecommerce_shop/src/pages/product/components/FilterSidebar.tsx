import { useState } from 'react';
import { LayoutGrid, PawPrint, Rabbit, Cat, Sparkles, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PriceKey = 'under10' | '10-15' | '15-20' | 'over20';

export type Filters = {
    category: string;
    price: PriceKey | null;
    color: string | null;
};

export const DEFAULT_FILTERS: Filters = { category: 'All', price: null, color: null };

export const CATEGORIES: { label: string; icon: LucideIcon }[] = [
    { label: 'All', icon: LayoutGrid },
    { label: 'Bears', icon: PawPrint },
    { label: 'Rabbits', icon: Rabbit },
    { label: 'Cats', icon: Cat },
    { label: 'Others', icon: Sparkles },
];

export const PRICE_RANGES: { key: PriceKey; label: string; test: (p: number) => boolean }[] = [
    { key: 'under10', label: 'Under $10', test: (p) => p < 10 },
    { key: '10-15', label: '$10 - $15', test: (p) => p >= 10 && p <= 15 },
    { key: '15-20', label: '$15 - $20', test: (p) => p > 15 && p <= 20 },
    { key: 'over20', label: 'Over $20', test: (p) => p > 20 },
];


type Props = {
    filters: Filters;
    onChange: (next: Filters) => void;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <section className="filter-section">
            <button
                type="button"
                className="filter-section__head"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                {title}
                <ChevronDown size={16} className={open ? 'is-open' : ''} aria-hidden />
            </button>
            {open && <div className="filter-section__body">{children}</div>}
        </section>
    );
}

export default function FilterSidebar({ filters, onChange }: Props) {
    const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

    return (
        <aside className="filter-sidebar" aria-label="Product filters">
            <h2 className="filter-sidebar__title">Categories</h2>
            <ul className="filter-cats">
                {CATEGORIES.map(({ label, icon: Icon }) => (
                    <li key={label}>
                        <button
                            type="button"
                            className={`filter-cats__item ${filters.category === label ? 'is-active' : ''}`}
                            aria-pressed={filters.category === label}
                            onClick={() => set({ category: label })}
                        >
                            <Icon size={16} aria-hidden /> {label}
                        </button>
                    </li>
                ))}
            </ul>

            <Section title="Price Range">
                <div role="radiogroup" aria-label="Price range">
                    {PRICE_RANGES.map(({ key, label }) => (
                        <label key={key} className="filter-radio">
                            <input
                                type="radio"
                                name="price"
                                checked={filters.price === key}
                                onChange={() => set({ price: key })}
                            />
                            <span className="filter-radio__dot" aria-hidden />
                            {label}
                        </label>
                    ))}
                </div>
                {filters.price && (
                    <button type="button" className="filter-clear" onClick={() => set({ price: null })}>
                        Clear price
                    </button>
                )}
            </Section>
        </aside>
    );
}