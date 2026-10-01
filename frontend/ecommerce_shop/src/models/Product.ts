
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  stockQuantity: number;
 
  rating?: number;
  reviews?: number;
};