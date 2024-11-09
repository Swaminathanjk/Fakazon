import { createSlice } from "@reduxjs/toolkit";

const usernameSlice = createSlice({
  name: "username",
  initialState: { username: "" },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload; // Set username
    },
    clearUsername(state) {
      state.username = null; // Clear username
    },
    setToken: (state, action) => {
      state.token = action.payload; // Set token in state
    },
  },
});

export const usernameActions = usernameSlice.actions;
export default usernameSlice;
