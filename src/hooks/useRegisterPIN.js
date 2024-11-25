import { useDispatch, useSelector } from 'react-redux';
import { postRegPayPin } from '../helpers/apiKupi';

export const useRegisterPIN = () => {
  const { user } = useSelector(state => state.Login);
  const dispatch = useDispatch();
  const registerPIN = async register => {
    console.log('llego aqui userregisterPIN');
    console.log('llega en register', register);
    try {
      const res = await postRegPayPin(register);
      console.log('data desde useRegisterPIN', res);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    //metodos
    registerPIN,
  };
};
