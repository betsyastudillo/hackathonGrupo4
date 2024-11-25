import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  sales: {},
  loading: true,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.data;
    },
    sales(state, action) {
      state.sales = action.payload;
      state.loading = false;
    },
  },
});

export const { apiError, sales } = salesSlice.actions;

export default salesSlice.reducer;
