import { configureStore, createSlice } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import fetchingSlice from "./FetchSlice";
import categorySlice from "./categorySlice";
import cartSlice from "./cartSlice";
import usernameSlice from "./usernameSlice";
import urlSlice from "./urlSlice";

const products = configureStore({
  reducer: {
    products: productSlice.reducer,
    fetchStatus: fetchingSlice.reducer,
    category: categorySlice.reducer,
    cart: cartSlice.reducer,
    user: usernameSlice.reducer,
    url: urlSlice.reducer,
  },
});

export default products;
