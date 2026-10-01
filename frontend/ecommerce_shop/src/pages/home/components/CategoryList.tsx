import {
    LayoutGrid,
    PawPrint,
    Rabbit,
    Cat,
    Heart,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

type Category = {
    name: string;
    icon: LucideIcon;
    tone: string;
};

const CATEGORIES: Category[] = [
    {
        name: 'All',
        icon: LayoutGrid,
        tone: 'pink',
    },
    {
        name: 'Bears',
        icon: PawPrint,
        tone: 'cream',
    },
    {
        name: 'Rabbits',
        icon: Rabbit,
        tone: 'lilac',
    },
    {
        name: 'Cats',
        icon: Cat,
        tone: 'lilac',
    },
    {
        name: 'Others',
        icon: Heart,
        tone: 'lilac',
    },
];

type CategoryListProps = {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
};

export default function CategoryList({
    selectedCategory,
    onCategoryChange,
}: CategoryListProps) {
    return (
        <ul className="categories">
            {CATEGORIES.map(
                ({ name, icon: Icon, tone }) => (
                    <li key={name}>
                        <button
                            className={`
                category
                category--${tone}
                ${selectedCategory === name ? 'is-active' : ''}
              `}
                            onClick={() =>
                                onCategoryChange(name)
                            }
                        >
                            <Icon
                                className="category__icon"
                                size={28}
                                strokeWidth={1.8}
                            />

                            {name}
                        </button>
                    </li>
                )
            )}
        </ul>
    );
}