// store/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [
      "All",
      "Electronics",
      "Furniture",
      "Clothing",
      "Jewelry",
      "Groceries",
    ], // Example categories
    selectedCategory: "All",
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setCategory } = categorySlice.actions;
export default categorySlice;
