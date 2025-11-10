import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// -----------------------------
// Fetch All Products
// -----------------------------
export const fetchAllProducts = createAsyncThunk(
  "shopProducts/fetchAllProducts",
  async ({ category = [], brand = [], sortBy = "price-lowtoHigh" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category.length) params.append("category", category.join(","));
      if (brand.length) params.append("brand", brand.join(","));
      if (sortBy) params.append("sortBy", sortBy);

      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get?${params.toString()}`,
        { withCredentials: true }
      );

      return response.data; // { success, count, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch products" }
      );
    }
  }
);

// -----------------------------
// Fetch Single Product
// -----------------------------
export const fetchProductDetails = createAsyncThunk(
  "shopProducts/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/products/${id}`,
        { withCredentials: true }
      );
      return response.data; // { success, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch product details" }
      );
    }
  }
);

// -----------------------------
// Initial State
// -----------------------------
const initialState = {
  loading: false,
  productList: [],
  productDetails: null,
  error: null,
};

// -----------------------------
// Slice
// -----------------------------
const shopProductSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.productList = [];
      state.productDetails = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // fetchAllProducts
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load products";
        state.productList = [];
      });

    // fetchProductDetails
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload?.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load product details";
        state.productDetails = null;
      });
  },
});

export const { clearProducts } = shopProductSlice.actions;
export default shopProductSlice.reducer;
