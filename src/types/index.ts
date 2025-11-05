export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  liked?: boolean;
}

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: 'all' | 'favorites';
  priceRange: [number, number]; // Добавляем новые поля
  categoryFilter: string;
  searchQuery: string;
}

export type RootState = {
  products: ProductsState;
};

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
}