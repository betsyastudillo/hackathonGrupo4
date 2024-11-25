import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  giftCardsKupi: [],
  giftCards: [],
  listPricesKupiKards: [],
  listPricesGiftCards: [],
};

export const giftCardsSlice = createSlice({
  name: 'giftcards',
  initialState,
  reducers: {
    setGiftCardsKupi(state, action) {
      state.giftCardsKupi = action.payload;
    },
    setGiftCards(state, action) {
      state.giftCards = action.payload;
    },
    setListPricesKupiKards(state, action) {
      state.listPricesKupiKards = action.payload;
    },
    setListPricesGiftCards(state, action) {
      state.listPricesGiftCards = action.payload;
    },
  },
});

export const {
  setGiftCardsKupi,
  setGiftCards,
  setListPricesKupiKards,
  setListPricesGiftCards,
} = giftCardsSlice.actions;

export default giftCardsSlice.reducer;
