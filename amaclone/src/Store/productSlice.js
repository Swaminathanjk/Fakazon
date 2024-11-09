import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "item",
  initialState: [],
  reducers: {
    addInitialProducts: (store, action) => {
      return action.payload;
    },
  },
});
export const productActions = productSlice.actions;

export default productSlice;
