import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type { Product } from '../../models/Product';
import Header from '../../components/header/Header';
import ProductCard from '../../components/product/ProductCard';
import { PRODUCTS } from '../../data/product';
import FilterSidebar, { DEFAULT_FILTERS, PRICE_RANGES, type Filters } from './components/FilterSidebar';

import './css/ProductPage.css';
import './css/FilterSidebar.css';
import { useCart } from '../../components/cart/CartContext';
const PAGE_SIZE = 8;

type SortKey = 'popularity' | 'price-asc' | 'price-desc' | 'rating';
type ProductWithColor = Product & { color?: string };

const SORTS: { key: SortKey; label: string }[] = [
    { key: 'popularity', label: 'Popularity' },
    { key: 'price-asc', label: 'Price: Low to High' },
    { key: 'price-desc', label: 'Price: High to Low' },
    { key: 'rating', label: 'Top rated' },
];

type Props = {
    products?: ProductWithColor[];
};

export default function ProductsPage({ products = PRODUCTS }: Props) {
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState<SortKey>('popularity');
    const [page, setPage] = useState(1);
    const { addItem } = useCart();

    const filtered = useMemo(() => {
        const priceTest = PRICE_RANGES.find((r) => r.key === filters.price)?.test;
        const q = keyword.toLowerCase();

        const list = products.filter((p) => {
            if (filters.category !== 'All' && p.category !== filters.category) return false;
            if (priceTest && !priceTest(Number(p.price))) return false;
            if (filters.color && p.color !== filters.color) return false;
            if (q && !p.name.toLowerCase().includes(q)) return false;
            return true;
        });

        return [...list].sort((a, b) => {
            switch (sort) {
                case 'price-asc': return Number(a.price) - Number(b.price);
                case 'price-desc': return Number(b.price) - Number(a.price);
                case 'rating': return (b.rating ?? 0) - (a.rating ?? 0);
                default: return (b.reviews ?? 0) - (a.reviews ?? 0);
            }
        });
    }, [products, filters, keyword, sort]);

    // pagination
    const total = filtered.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);

    const currentPage = Math.min(
        page,
        Math.max(pageCount, 1)
    );

    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const visibleProducts = filtered.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const changeFilters = (next: Filters) => { setFilters(next); setPage(1); };
    const resetAll = () => { setFilters(DEFAULT_FILTERS); setKeyword(''); setPage(1); };

    const goTo = (nextPage: number) => {
        const safePage = Math.max(
            1,
            Math.min(nextPage, pageCount || 1)
        );

        setPage(safePage);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Header
                active="Product"
                onSearch={(k) => { setKeyword(k); setPage(1); }}
            />

            <main className="products-page">
                <FilterSidebar filters={filters} onChange={changeFilters} />

                <section className="products-main" aria-labelledby="products-title">
                    <div className="products-toolbar">
                        <div>
                            <h1 id="products-title">All Products</h1>
                            <p className="products-toolbar__count">
                                {total === 0
                                    ? 'No products found'
                                    : `Showing ${startIndex + 1}–${startIndex + visibleProducts.length} of ${total} products`}
                            </p>
                        </div>

                        <label className="products-sort">
                            <span>Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
                            >
                                {SORTS.map((s) => (
                                    <option key={s.key} value={s.key}>{s.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} aria-hidden />
                        </label>
                    </div>

                    {visibleProducts.length > 0 ? (
                        <div className="products-grid">
                            {visibleProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onAddToCart={(prod) => addItem(prod)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="products-empty">
                            <p>No plushies match your filters.</p>
                            <button type="button" onClick={resetAll}>
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {pageCount > 1 && (
                        <nav className="pagination" aria-label="Pagination">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={currentPage === 1}
                                onClick={() => goTo(currentPage - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: pageCount }, (_, index) => {
                                const pageNumber = index + 1;

                                return (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        className={pageNumber === currentPage ? 'is-active' : ''}
                                        aria-current={
                                            pageNumber === currentPage ? 'page' : undefined
                                        }
                                        onClick={() => goTo(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={currentPage === pageCount}
                                onClick={() => goTo(currentPage + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </nav>
                    )}
                </section>
            </main>
        </>
    );
}