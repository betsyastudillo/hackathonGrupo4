import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  user: {},
  error: '',
  loading: false,
  isUserLogout: false,
  errorMsg: false,
  forgot: false,
  msgForgot: '1234',
  validate: false,
  openModalRecover: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state) {
      state.isUserLogout = true;
    },
    resetLogin(state) {
      state.error = null;
      state.loading = false;
      state.errorMsg = false;
    },
    forgotPass(state, action) {
      state.forgot = true;
      state.msgForgot = action.payload.telUsuario;
    },
    validateOTPSuccess(state) {
      state.validate = true;
    },
    recoverPassSuccess(state) {
      state.openModalRecover = true;
    },
    switchEmpresa(state, action) {
      const { payload } = action;

      state.user.codEmpresa = payload.codEmpresa;
      state.user.codPerfil = payload.codPerfil;
      state.user.nomEmpresa = payload.nomEmpresa;
      state.user.token = payload.token;
      // console.log(state);

      try {
        localStorage.setItem('user', JSON.stringify(state.user));
      } catch (error) {
        console.error('Error saving companies to localStorage', error);
      }
    },
  },
});

// Setters
export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  resetLogin,
  forgotPass,
  validateOTPSuccess,
  recoverPassSuccess,
  switchEmpresa,
} = loginSlice.actions;

export default loginSlice.reducer;
