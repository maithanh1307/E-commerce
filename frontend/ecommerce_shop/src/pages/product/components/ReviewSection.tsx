import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../../../models/Review';

const PAGE = 3;

type Props = {
    initialReviews: Review[];
    onSubmit?: (review: Review) => void;
};

function Stars({ value, size = 16 }: { value: number; size?: number }) {
    return (
        <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={size} fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
            ))}
        </span>
    );
}

export default function ReviewSection({ initialReviews, onSubmit }: Props) {
    const [reviews, setReviews] = useState(initialReviews);
    const [visible, setVisible] = useState(PAGE);
    const [formOpen, setFormOpen] = useState(false);

    const [rating, setRating] = useState(0);
    const [author, setAuthor] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const stats = useMemo(() => {
        const total = reviews.length;
        const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.rating === n).length);
        const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
        return { total, counts, avg };
    }, [reviews]);

    const closeForm = () => {
        setFormOpen(false);
        setRating(0);
        setAuthor('');
        setComment('');
        setError('');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return setError('Please choose a star rating.');
        if (comment.trim().length < 10) return setError('Please write at least 10 characters.');

        const review: Review = {
            id: Date.now(),
            author: author.trim() || 'Anonymous',
            rating,
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
        };
        setReviews((list) => [review, ...list]);
        onSubmit?.(review);
        closeForm();
    };

    return (
        <section id="reviews" className="reviews" aria-labelledby="reviews-title">
            <div className="reviews__head">
                <h2 id="reviews-title">Customer reviews</h2>
                {!formOpen && (
                    <button type="button" className="reviews__write" onClick={() => setFormOpen(true)}>
                        Write a review
                    </button>
                )}
            </div>

            <div className="reviews__layout">
                <aside className="reviews__summary" aria-label="Rating summary">
                    <div className="reviews__avg">
                        <strong>{stats.avg.toFixed(1)}</strong>
                        <Stars value={stats.avg} size={18} />
                        <span>{stats.total} {stats.total === 1 ? 'review' : 'reviews'}</span>
                    </div>

                    <ul className="reviews__bars">
                        {[5, 4, 3, 2, 1].map((n, i) => (
                            <li key={n}>
                                <span>{n}</span>
                                <Star size={12} fill="currentColor" aria-hidden />
                                <div className="reviews__bar">
                                    <i style={{ width: `${stats.total ? (stats.counts[i] / stats.total) * 100 : 0}%` }} />
                                </div>
                                <span className="reviews__count">{stats.counts[i]}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div>
                    {formOpen && (
                        <form className="review-form" onSubmit={submit} noValidate>
                            <fieldset>
                                <legend>Your rating</legend>
                                <div className="review-form__stars">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            aria-label={`${n} star${n > 1 ? 's' : ''}`}
                                            aria-pressed={rating === n}
                                            onClick={() => setRating(n)}
                                        >
                                            <Star size={26} fill={n <= rating ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <label>
                                Name (optional)
                                <input value={author} maxLength={40} onChange={(e) => setAuthor(e.target.value)} />
                            </label>

                            <label>
                                Your review
                                <textarea
                                    rows={4}
                                    maxLength={500}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like about this plushie?"
                                />
                            </label>

                            {error && <p className="review-form__error" role="alert">{error}</p>}

                            <div className="review-form__actions">
                                <button type="button" className="is-ghost" onClick={closeForm}>Cancel</button>
                                <button type="submit">Submit review</button>
                            </div>
                        </form>
                    )}

                    {reviews.length === 0 ? (
                        <p className="reviews__empty">
                            No reviews yet. Be the first to review this plushie.
                        </p>
                    ) : (
                        <ul className="reviews__list">
                            {reviews.slice(0, visible).map((r, i) => (
                                <li key={r.id} className="review">
                                    <span
                                        className={`review__avatar tone-${i % 3}`}
                                        aria-hidden
                                    >
                                        {r.author.charAt(0).toUpperCase()}
                                    </span>

                                    <div>
                                        <div className="review__meta">
                                            <strong>{r.author}</strong>

                                            <time dateTime={r.createdAt}>
                                                {new Date(r.createdAt).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }
                                                )}
                                            </time>
                                        </div>

                                        <Stars value={r.rating} size={14} />

                                        <p>{r.comment}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {reviews.length > PAGE && (
                        <button
                            type="button"
                            className="reviews__more"
                            onClick={() => {
                                if (visible >= reviews.length) {
                                    setVisible(PAGE);
                                } else {
                                    setVisible((v) =>
                                        Math.min(v + PAGE, reviews.length)
                                    );
                                }
                            }}
                        >
                            {visible >= reviews.length
                                ? 'Show less'
                                : `Show more reviews (${reviews.length - visible})`}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}