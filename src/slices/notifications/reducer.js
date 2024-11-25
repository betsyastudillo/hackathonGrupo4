import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  providersSMS: [],
};

export const providersSlice = createSlice({
  name: 'providersSMS',
  initialState,
  reducers: {
    setProvidersSMS(state, action) {
      state.providersSMS = action.payload;
    },
  },
});

export const { setProvidersSMS } = providersSlice.actions;
export default providersSlice.reducer;
