import type { Review } from '../models/Review';

const AUTHORS = ['Linh N.', 'Minh T.', 'Hannah P.', 'Khoa D.', 'Mai A.', 'Sophie L.', 'Bao C.', 'Yuki M.'];
const COMMENTS = [
    'So soft and cuddly! My daughter takes it everywhere.',
    'Great quality for the price. The stitching is neat and nothing sheds.',
    'Arrived quickly and looks exactly like the photos.',
    'A bit smaller than I expected, but still adorable.',
    'Bought it as a gift and it was a huge hit.',
    'Washes well and keeps its shape. Would buy again.',
    'The fabric feels premium. Perfect for hugging while watching movies.',
    'Cute, but the color is slightly lighter than shown.',
];
const RATINGS = [5, 5, 4, 5, 4, 3, 5, 4];

export function getReviews(productId: number | string): Review[] {
    const seed = Number(productId) || 0;
    return AUTHORS.map((author, i) => ({
        id: `${productId}-${i}`,
        author,
        rating: RATINGS[(i + seed) % RATINGS.length],
        comment: COMMENTS[(i + seed) % COMMENTS.length],
        createdAt: new Date(2026, 8, 28 - i * 4).toISOString(),
    }));
}