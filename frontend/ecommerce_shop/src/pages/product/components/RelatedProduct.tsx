import ProductCard from '../../../components/product/ProductCard';
import type { Product } from '../../../models/Product';

type Props = {
    current: Product;
    products: Product[];
    limit?: number;
    onAddToCart?: (product: Product) => void;
};

export default function RelatedProducts({ current, products, limit = 4, onAddToCart }: Props) {
    const others = products.filter((p) => p.id !== current.id);
    const byPopularity = (a: Product, b: Product) => (b.reviews ?? 0) - (a.reviews ?? 0);

    // same category first, then other categories
    const items = [
        ...others.filter((p) => p.category === current.category).sort(byPopularity),
        ...others.filter((p) => p.category !== current.category).sort(byPopularity),
    ].slice(0, limit);

    if (items.length === 0) return null;

    return (
        <section className="related" aria-labelledby="related-title">
            <h2 id="related-title">You may also like</h2>
            <div className="related__grid">
                {items.map((p) => (
                    <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
                ))}
            </div>
        </section>
    );
}