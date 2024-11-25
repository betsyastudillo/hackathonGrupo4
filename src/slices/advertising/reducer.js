import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  advertising: [],
};

export const advertisingSlice = createSlice({
  name: 'advertising',
  initialState,
  reducers: {
    setAdvertising(state, action) {
      state.advertising = action.payload;
    },
  },
});

export const { setAdvertising } = advertisingSlice.actions;
export default advertisingSlice.reducer;
