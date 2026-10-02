import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Heart,
    Minus,
    PawPrint,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Product } from '../../models/Product';
import { PRODUCTS } from '../../data/product';
import Header from '../../components/header/Header';
import ReviewSection from './components/ReviewSection';
import { getReviews } from '../../data/review';
import RelatedProducts from './components/RelatedProduct';

import './css/ProductDetailPage.css';
import './css/ReviewSection.css';
import './css/RelatedProduct.css';


export type ProductDetail = Product & {
    images?: string[];
    originalPrice?: number;
    colors?: { name: string; hex: string }[];
    sizes?: string[];
};

export type Selection = { color?: string; size?: string; quantity: number };

const PERKS: { icon: LucideIcon; title: string; text: string; tone: 'lilac' | 'pink' }[] = [
    { icon: Truck, title: 'Free Shipping', text: 'For orders over $50', tone: 'lilac' },
    { icon: ShieldCheck, title: 'Secure Payment', text: '100% safe & reliable', tone: 'lilac' },
    { icon: Heart, title: 'Easy Returns', text: 'Within 7 days', tone: 'pink' },
];

type Handlers = {
    onAddToCart?: (product: ProductDetail, selection: Selection) => void;
    onBuyNow?: (product: ProductDetail, selection: Selection) => void;
};

type Props = Handlers & { product?: ProductDetail };

// get id from url
export default function ProductDetailPage({ product: productProp, ...handlers }: Props) {
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const product = productProp ?? (PRODUCTS as ProductDetail[]).find((p) => String(p.id) === id);

    if (!product) {
        return (
            <>
                <Header active="Product" />
                <main className="pd-empty">
                    <PawPrint size={56} strokeWidth={1.3} aria-hidden />
                    <h1>Product not found</h1>
                    <p>This plushie may have been removed or the link is incorrect.</p>
                    <Link to="/products" className="pd-btn pd-btn--primary">Back to products</Link>
                </main>
            </>
        );
    }

    // reset state before render new product
    return <ProductDetailView key={product.id} product={product} {...handlers} />;
}

function ProductDetailView({
    product,
    onAddToCart,
    onBuyNow,
}: Handlers & { product: ProductDetail }) {
    const {
        name, description, price: rawPrice, originalPrice, rating, reviews,
        stockQuantity, colors = [], sizes = [],
    } = product;

    const price = Number(rawPrice);
    const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
    const discount = originalPrice && originalPrice > price
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;
    const soldOut = stockQuantity <= 0;
    const maxQty = Math.max(1, Math.min(stockQuantity, 99));

    const [activeImg, setActiveImg] = useState(0);
    const [wished, setWished] = useState(false);
    const [color, setColor] = useState(colors[0]?.name);
    const [size, setSize] = useState(sizes[0]);
    const [qty, setQty] = useState(1);
    const [cartCount, setCartCount] = useState(0);

    const selection: Selection = { color, size, quantity: qty };
    const clamp = (n: number) => Math.min(maxQty, Math.max(1, n));

    const addToCart = () => {
        setCartCount((c) => c + qty);
        onAddToCart?.(product, selection);
    };

    return (
        <>
            <Header active="Product" cartCount={cartCount} />

            <main className="pd">
                <section className="pd-gallery" aria-label="Product images">
                    {images.length > 1 && (
                        <ul className="pd-thumbs">
                            {images.map((src, i) => (
                                <li key={src}>
                                    <button
                                        type="button"
                                        className={i === activeImg ? 'is-active' : ''}
                                        aria-label={`Show image ${i + 1}`}
                                        aria-pressed={i === activeImg}
                                        onClick={() => setActiveImg(i)}
                                    >
                                        <img src={src} alt="" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="pd-stage">
                        <button
                            type="button"
                            className={`pd-stage__fav ${wished ? 'is-active' : ''}`}
                            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                            aria-pressed={wished}
                            onClick={() => setWished((w) => !w)}
                        >
                            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
                        </button>

                        {images[activeImg] ? (
                            <img src={images[activeImg]} alt={name} />
                        ) : (
                            <PawPrint className="pd-stage__placeholder" size={96} strokeWidth={1.2} aria-hidden />
                        )}
                    </div>
                </section>

                <section className="pd-info" aria-labelledby="pd-title">
                    <h1 id="pd-title" className="pd-title">{name}</h1>

                    <div className="pd-price">
                        <strong>${price.toFixed(2)}</strong>
                        {discount > 0 && (
                            <>
                                <s>${originalPrice!.toFixed(2)}</s>
                                <span className="pd-price__badge">-{discount}%</span>
                            </>
                        )}
                    </div>

                    <div className="pd-rating">
                        <Star size={16} fill="currentColor" aria-hidden />
                        {rating !== undefined ? (
                            <>
                                <b>{rating.toFixed(1)}</b>{' '}
                                (<a href="#reviews" className="pd-rating__link">{reviews ?? 0} reviews</a>)
                            </>
                        ) : (
                            'No reviews yet'
                        )}
                    </div>

                    <p className="pd-desc">{description || 'No description yet.'}</p>

                    {colors.length > 0 && (
                        <fieldset className="pd-opt">
                            <legend>Color{color ? `: ${color}` : ''}</legend>
                            <div className="pd-swatches">
                                {colors.map((c) => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        className={c.name === color ? 'is-active' : ''}
                                        style={{ background: c.hex }}
                                        aria-label={c.name}
                                        aria-pressed={c.name === color}
                                        onClick={() => setColor(c.name)}
                                    />
                                ))}
                            </div>
                        </fieldset>
                    )}

                    {sizes.length > 0 && (
                        <fieldset className="pd-opt">
                            <legend>Size</legend>
                            <div className="pd-sizes">
                                {sizes.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={s === size ? 'is-active' : ''}
                                        aria-pressed={s === size}
                                        onClick={() => setSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    <div className="pd-opt">
                        <span className="pd-opt__label">Quantity</span>
                        <div className="pd-buy">
                            <div className="pd-qty">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={soldOut || qty <= 1}
                                    onClick={() => setQty((q) => clamp(q - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    max={maxQty}
                                    value={qty}
                                    disabled={soldOut}
                                    aria-label="Quantity"
                                    onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
                                />
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={soldOut || qty >= maxQty}
                                    onClick={() => setQty((q) => clamp(q + 1))}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button type="button" className="pd-btn pd-btn--primary" disabled={soldOut} onClick={addToCart}>
                                <ShoppingCart size={18} />
                                {soldOut ? 'Sold out' : 'Add to Cart'}
                            </button>
                        </div>
                        {!soldOut && stockQuantity <= 5 && (
                            <p className="pd-stock">Only {stockQuantity} left</p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="pd-btn pd-btn--soft"
                        disabled={soldOut}
                        onClick={() => onBuyNow?.(product, selection)}
                    >
                        Buy Now
                    </button>
                </section>

                <ul className="pd-perks">
                    {PERKS.map(({ icon: Icon, title, text, tone }) => (
                        <li key={title}>
                            <span className={`pd-perks__icon is-${tone}`}><Icon size={22} aria-hidden /></span>
                            <span>
                                <strong>{title}</strong>
                                <small>{text}</small>
                            </span>
                        </li>
                    ))}
                </ul>

                <ReviewSection initialReviews={getReviews(product.id)} />

                <RelatedProducts
                    current={product}
                    products={PRODUCTS as Product[]}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                />
            </main>
        </>
    );
}