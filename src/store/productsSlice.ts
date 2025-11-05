import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '../types';

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  priceRange: [0, 10000],
  categoryFilter: 'all',
  searchQuery: ''
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (): Promise<Product[]> => {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productDeleted: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    productToggled: (state, action: PayloadAction<number>) => {
      const existingProduct = state.items.find(product => product.id === action.payload);
      if (existingProduct) {
        existingProduct.liked = !existingProduct.liked;
      }
    },
    productAdded: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    productUpdated: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    filterChanged: (state, action: PayloadAction<'all' | 'favorites'>) => {
      state.filter = action.payload;
    },
    priceRangeChanged: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    categoryFilterChanged: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    searchQueryChanged: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    filtersReset: (state) => {
      state.priceRange = [0, 10000];
      state.categoryFilter = 'all';
      state.searchQuery = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { 
  productDeleted, 
  productToggled, 
  productAdded, 
  productUpdated,
  filterChanged, 
  priceRangeChanged,
  categoryFilterChanged,
  searchQueryChanged,
  filtersReset
} = productsSlice.actions;

export const selectFilteredProducts = (state: { products: ProductsState }): Product[] => {
  const { items, filter, priceRange, categoryFilter, searchQuery } = state.products;
  
  let filteredProducts = items;

  if (filter === 'favorites') {
    filteredProducts = filteredProducts.filter(product => product.liked);
  }

  filteredProducts = filteredProducts.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category === categoryFilter
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  }

  return filteredProducts;
};

export const selectUniqueCategories = (state: { products: ProductsState }): string[] => {
  const categories = state.products.items.map(product => product.category);
  return ['all', ...Array.from(new Set(categories))].sort();
};

export default productsSlice.reducer;