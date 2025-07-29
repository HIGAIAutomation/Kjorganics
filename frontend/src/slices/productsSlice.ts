import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  images: any[];
  status: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.products[idx] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

export const { setProducts, setLoading, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
