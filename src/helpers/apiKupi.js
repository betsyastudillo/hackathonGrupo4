import { APIClientPython } from './api_helper_kupi';
import * as url from './url_helper';

const api = new APIClientPython();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

// is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Auth
export const kupiLogin = data => api.create(url.LOGIN, data);
export const kupiForgotPassword = data => api.create(url.FORGOT, data);
export const kupiValidateOTP = data => api.create(url.VALIDATE, data);
export const kupiRecoverPass = data => api.create(url.RECOVER, data);

// PayPIN
export const postRegPayPin = data => api.create(url.REGPAYPIN, data);

// PayQR
export const postRegPayQr = data => api.create(url.REGPAYQR, data);
export const postAnularRegPayQr = data => api.create(url.ANUREGPAYQR, data);
export const postInfoRegPayQr = data => api.create(url.INFOQR, data);

// Sales
export const getSales = data => api.create(url.SALES_USER, data);
