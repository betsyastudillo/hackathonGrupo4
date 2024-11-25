import { jwtDecode } from 'jwt-decode';

import { kupiForgotPassword, kupiValidateOTP, kupiRecoverPass } from '../../../helpers/apiKupi';
import { loginSuccess, logoutUserSuccess, apiError, resetLogin, forgotPass, validateOTPSuccess, recoverPassSuccess } from './reducer';

import { KupiloginWS } from '../../users/thunk';



export const resetLoginFlag = () => async dispatch => {
  try {
    const response = dispatch(resetLogin());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};

//--------------------------------- Owner Kupi --------------------------
export const logoutUser = () => async dispatch => {
  try {
    localStorage.removeItem('user');
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const forgotPassword = (user, navigate) => async dispatch => {
  try {
    const res = await kupiForgotPassword({
      tipoDocumento: user.typeDocument,
      numDocumento: user.document,
    });
    // console.log('llega de res thunks', res);
    const forgot = {
      telUsuario: res.data.telUsuario,
    };
    // console.log('llega en telusuario', forgot.telUsuario);
    dispatch(forgotPass(forgot));
    // Pasé los datos como estado de navegación
    navigate('/recover-password', {
      state: { tipoDocumento: user.typeDocument, numDocumento: user.document },
    });
  } catch (error) {
    console.log(error);
  }
};

export const validateOTP = user => async dispatch => {
  try {
    const res = await kupiValidateOTP({
      tipoDocumento: user.typeDocument,
      numDocumento: user.document,
      resetOTP: user.verificationCode,
    });
    // console.log('llega de res thunks validateOTP', res);
    if (res?.status === true) {
      dispatch(validateOTPSuccess());
    } else {
      throw new Error('Validación de OTP fallida');
    }
  } catch (error) {
    console.log(error);
  }
};

export const recoverPass = user => async dispatch => {
  try {
    const res = await kupiRecoverPass({
      tipoDocumento: user.typeDocument,
      numDocumento: user.document,
      resetOTP: user.resetOTP,
      clave: user.newPassword,
    });
    // console.log('llega de res thunks recoverPass', res);
    if (res?.status === true) {
      dispatch(recoverPassSuccess());
    } else {
      throw new Error('Validación de OTP fallida');
    }
  } catch (error) {
    console.log(error);
  }
};

export const loginApp = (user, history) => async dispatch => {
  try {

    const dataR = {
      bodyOptions: {
        tipoDocumento: user.typeDocument,
        documento: user.document,
        clave: user.password,
      }
    }
    const response = await KupiloginWS(dataR);

    if (response.data?.token) {
      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      const user_final = {
        nomUsuario: decodedToken.userName,
        apeUsuario: decodedToken.userLastName,
        codUsuario: decodedToken.userID,
        codPerfil: decodedToken.codPerfil,
        codEmpresa: decodedToken.codEmpresa,
        exp: decodedToken.exp,
        token: token,
      };

      localStorage.setItem('user', JSON.stringify(user_final));
      dispatch(loginSuccess(user_final));
      history('/dashboard');
    } else {
      throw new Error('Token not received');
    }
  } catch (error) {
    console.error('Error en el try/catch:', error);
    dispatch(apiError('Solicitud incorrecta. Verifique los datos ingresados.'));
  }
};
