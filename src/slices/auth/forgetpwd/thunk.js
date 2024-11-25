// import { userForgetPasswordSuccess, userForgetPasswordError } from './reducer';

//Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";

// import {
//   postFakeForgetPwd,
//   postJwtForgetPwd,
// } from "../../../helpers/fakebackend_helper";

// const fireBaseBackend = getFirebaseBackend();

// export const forgotPassword = (user, history) => async dispatch => {
//   try {
//     const response = await kupiForgotPassword({
//       tipoDocumento: user.typeDocument,
//       documento: user.document,
//     });
//     if (response.data) {
//       localStorage.setItem('user', JSON.stringify(user_final));
//       dispatch(loginSuccess(user_final));
//       history('/recover-password');
//     }
//   } catch (error) {
//     console.error('Error en el try/catch:', error);
//     dispatch(apiError('Solicitud incorrecta. Verifique los datos ingresados.'));
//   }
// };

// export const userForgetPassword = (user, history) => async dispatch => {
//   try {
//     let response;
//     if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
//       response = fireBaseBackend.forgetPassword(user.email);
//     } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
//       response = postJwtForgetPwd(user.email);
//     } else {
//       response = postFakeForgetPwd(user.email);
//     }

//     const data = await response;

//     if (data) {
//       dispatch(
//         userForgetPasswordSuccess(
//           'Reset link are sended to your mailbox, check there first'
//         )
//       );
//     }
//   } catch (forgetError) {
//     dispatch(userForgetPasswordError(forgetError));
//   }
// };
