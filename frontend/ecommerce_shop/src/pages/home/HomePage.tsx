import { useMemo, useState } from 'react';
import { Crown, Star } from 'lucide-react';

import Header from '../../components/header/Header';
import ProductCard from '../../components/product/ProductCard';
import { PRODUCTS } from '../../data/product';
import type { Product } from '../../models/Product';

import SectionHead from './components/SectionHead';
import CategoryList from './components/CategoryList';
import Banner from './components/Banner';
import Perk from './components/Perk';
import About from './components/About';

import './css/HomePage.css';
import './css/Banner.css';
import './css/CategoryList.css';
import './css/Perk.css';
import './css/SectioinHead.css';
import './css/About.css';

const SECTION_SIZE = 5;

export default function Home() {
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState<Record<number, number>>({});

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const handleAddToCart = (product: Product) => {
        setCart((current) => {
            const qty = current[product.id] ?? 0;
            if (qty >= product.stockQuantity) return current; // stock limit reached, do not add more
            return { ...current, [product.id]: qty + 1 };
        });
    };

    // filter by category, sort by rating, take top SECTION_SIZE
    const featured = useMemo(
        () =>
            PRODUCTS.filter((p) => category === 'All' || p.category === category)
                .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                .slice(0, SECTION_SIZE),
        [category],
    );

    // best sellers: sort by reviews, take top SECTION_SIZE
    const bestSellers = useMemo(
        () =>
            [...PRODUCTS]
                .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
                .slice(0, SECTION_SIZE),
        [],
    );

    return (
        <div className="home">
            <Header active="Home" cartCount={cartCount} />

            <Banner />

            <main className="container">
                <About />
                <CategoryList selectedCategory={category} onCategoryChange={setCategory} />

                <SectionHead icon={Star} title="Featured Products" />
                {featured.length > 0 ? (
                    <div className="grid">
                        {featured.map((p) => (
                            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                ) : (
                    <p className="empty">No plushies in “{category}” yet. Try another category!</p>
                )}

                <Perk />

                <SectionHead icon={Crown} title="Best Sellers" />
                <div className="grid">
                    {bestSellers.map((p, i) => (
                        <ProductCard key={p.id} product={p} rank={i + 1} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </main>
        </div>
    );
}