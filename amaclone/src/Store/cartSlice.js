import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Array to store product IDs or other cart data
    count: 0, // Initialize count to zero
  },
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload); // Add item to items array
      state.count += 1; // Increment count
    },
    removeFromCart(state, action) {
      const index = state.items.findIndex(item => item === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
        state.count -= 1; // Decrement count
      }
    },
    setCartCnt(state, action) {
      state.count = action.payload; // Directly set count
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;



// removeAllItem: (state, action) => {
//   //   // Filter out items matching the payload
//   //   return state.filter((item) => item.productId !== action.payload);
//   // },