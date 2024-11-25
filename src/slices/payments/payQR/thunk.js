import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onRegisterQR, onAnularQR, onInfoQR } from './reducer';

import {
  postRegPayPin as postRegPayPinApi,
  postRegPayQr as postRegPayQrApi,
  postAnularRegPayQr as postAnularRegPayQrApi,
  postInfoRegPayQr as postInfoRegPayQrApi,
} from '@/helpers/apiKupi';

export const addNewRegisterPIN = createAsyncThunk(
  'registerPIN/addNewRegPIN',
  async register => {
    try {
      const response = await postRegPayPinApi(register);
      console.log('respuesta del thunk', response);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addNewRegisterQR = createAsyncThunk(
  'registerQR/addNewRegQR',
  async (register, { dispatch }) => {
    try {
      const res = await postRegPayQrApi(register);
      console.log('llega register al thunk', register);
      console.log('llega del response del thunk', res);
      if (res.status) {
        toast.success(res.message, { autoClose: 5000 });
        dispatch(
          onRegisterQR({
            showQR: true,
            message: res.message,
            idTransaccion: res.id_transaccion,
            codQr: res.codQr,
          })
        );
      } else {
        toast.error(res.message, { autoClose: 5000 });
      }
    } catch (error) {
      return error;
    }
  }
);

export const anularRegisterQR = createAsyncThunk(
  'registerQR/anularRegQR',
  async (register, { dispatch }) => {
    try {
      const res = await postAnularRegPayQrApi(register);
      console.log('llega register al thunk', register);
      console.log('llega del response del thunk', res);
      if (res.status) {
        toast.success(res.message, { autoClose: 5000 });
        dispatch(
          onAnularQR({
            showQR: false,
            message: res.message,
            idTransaccion: '',
            codQr: '',
          })
        );
      } else {
        toast.error(res.message, { autoClose: 5000 });
      }
    } catch (error) {
      return error;
    }
  }
);

export const infoRegisterQR = createAsyncThunk(
  'registerQR/infoRegQR',
  async (register, { dispatch }) => {
    try {
      const res = await postInfoRegPayQrApi(register);
      console.log('llega register al thunk de info', register);
      console.log('llega del response del thunk de info', res);
      if (res.status) {
        toast.success(res.message, { autoClose: 5000 });
        dispatch(
          onInfoQR({
            message: res.message,
            codEstado: res.codEstado,
          })
        );
      } else {
        toast.error(res.message, { autoClose: 5000 });
      }
    } catch (error) {
      return error;
    }
  }
);

