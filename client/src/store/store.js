import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductsReducer from "./admin/product-slice";
import shopProductSlice from "./shop/product-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shopProducts: shopProductSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
