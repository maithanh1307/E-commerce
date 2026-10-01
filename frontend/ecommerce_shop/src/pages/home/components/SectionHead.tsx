import {
    ArrowRight,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

type SectionHeaderProps = {
    icon: LucideIcon;
    title: string;
    linkText?: string;
};

export default function SectionHeader({
    icon: Icon,
    title,
    linkText = 'View All',
}: SectionHeaderProps) {
    return (
        <div className="section-head">
            <h2>
                <Icon
                    className="section-head__icon"
                    size={26}
                    fill="currentColor"
                    strokeWidth={1.5}
                />

                {title}
            </h2>

            <a href="#" className="link">
                {linkText}
                <ArrowRight size={16} />
            </a>
        </div>
    );
}