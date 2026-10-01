import { useState } from 'react';
import { Heart, ShoppingCart, Star, PawPrint } from 'lucide-react';

import type { Product } from '../../models/Product';
import './ProductCard.css';

const LOW_STOCK_THRESHOLD = 5;

type ProductCardProps = {
    product: Product;
    rank?: number;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product, wished: boolean) => void;
};

export default function ProductCard({
    product,
    rank,
    onAddToCart,
    onToggleWishlist,
}: ProductCardProps) {
    const [wished, setWished] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const { name, description, imageUrl, category, stockQuantity, rating, reviews } = product;
    const price = Number(product.price); 
    const soldOut = stockQuantity <= 0;
    const lowStock = !soldOut && stockQuantity <= LOW_STOCK_THRESHOLD;
    const showImage = Boolean(imageUrl) && !imageFailed;

    const toggleWishlist = () => {
        const next = !wished;
        setWished(next);
        onToggleWishlist?.(product, next);
    };

    return (
        <article className={`product-card ${soldOut ? 'is-sold-out' : ''}`}>
            <div className="product-card__media">
                {rank && <span className={`product-card__rank rank-${rank}`}>{rank}</span>}

                <button
                    type="button"
                    className={`product-card__fav ${wished ? 'is-active' : ''}`}
                    aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wished}
                    onClick={toggleWishlist}
                >
                    <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
                </button>

                {showImage ? (
                    <img
                        src={imageUrl!}
                        alt={name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <PawPrint className="product-card__placeholder" size={64} strokeWidth={1.4} aria-hidden />
                )}

                {soldOut && <span className="product-card__soldout">Out of stock</span>}
            </div>

            <div className="product-card__body">
                {category && <span className="product-card__category">{category}</span>}

                <h3 className="product-card__name" title={name}>{name}</h3>

                <p className="product-card__desc">
                    {description || 'No description yet.'}
                </p>

                <div className="product-card__rating">
                    <Star size={13} fill="currentColor" />
                    {rating !== undefined ? (
                        <>
                            {rating.toFixed(1)} ({reviews ?? 0})
                        </>
                    ) : (
                        'No reviews yet'
                    )}
                </div>

                <div className="product-card__footer">
                    <strong className="product-card__price">${price.toFixed(2)}</strong>
                    {lowStock && (
                        <span className="product-card__stock">Only {stockQuantity} left</span>
                    )}
                </div>
            </div>

            <button
                type="button"
                className="product-card__btn"
                disabled={soldOut}
                onClick={() => onAddToCart?.(product)}
            >
                <ShoppingCart size={16} />
                {soldOut ? 'Sold out' : 'Add to Cart'}
            </button>
        </article>
    );
}