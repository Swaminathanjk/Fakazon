import { createSlice } from "@reduxjs/toolkit";

const fetchingSlice = createSlice({
  name: "fetching",
  initialState: {
    fetchDone: false,
    CurrFetching: false,
  },
  reducers: {
    markfetchDone: (state) => {
      state.fetchDone = true;
    },
    fetchingStart: (state) => {
      state.CurrFetching = true;
    },
    fetchingEnd: (state) => {
      state.CurrFetching = false;
    },
  },
});

export const fetchingActions = fetchingSlice.actions;

export default fetchingSlice;
