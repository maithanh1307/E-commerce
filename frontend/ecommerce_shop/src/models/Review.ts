export type Review = {
    id: number | string;
    author: string;
    rating: number; // 1–5
    comment: string;
    createdAt: string; // ISO date
};