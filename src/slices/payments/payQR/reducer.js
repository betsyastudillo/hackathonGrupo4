import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  showQR: false,
  message: '',
  idTransaccion: '',
  codQr: '',
  codEstado: '',
};

const payQRSlice = createSlice({
  name: 'payQR',
  initialState,
  reducers: {
    onRegisterQR: (state, action) => {
      console.log('lo que llega en onRegisterQR', action.payload);
      state.showQR = true;
      state.message = action.payload.message;
      state.idTransaccion = action.payload.idTransaccion;
      state.codQr = action.payload.codQr;
    },
    onAnularQR: (state, action) => {
      console.log('lo que llega en onAnularQR', action.payload);
      state.showQR = false;
      state.message = action.payload.message;
      state.idTransaccion = '';
      state.codQr = '';
    },
    onInfoQR: (state, action) => {
      console.log('lo que llega en onInfoQR', action.payload);
      state.message = action.payload.message;
      state.codEstado = action.payload.codEstado;
    },
  },
});

export const { onRegisterQR, onAnularQR, onInfoQR } = payQRSlice.actions;
export default payQRSlice.reducer;
