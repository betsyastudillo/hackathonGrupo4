import { useDispatch, useSelector } from 'react-redux';
import { postKupiLogin } from '../helpers/apiKupi';
import { loginSuccess } from '../slices/auth/login/reducer';
import { useNavigate } from 'react-router-dom';

export const useAuthStore = () => {
  const { user, error, loading } = useSelector(state => state.Login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const startLogin = async ({ user, pass, type }) => {
    // console.log({ user, pass });
    console.log('llega en user', user);
    console.log('llega en pass', pass);
    console.log('llega en type', type);
    try {
      const res = await postKupiLogin({
        documento: user,
        clave: pass,
        tipoDocumento: type,
      });
      console.log('data desde useAtuthStore', res);
      const jsonString = JSON.stringify(res);
      localStorage.setItem('user', jsonString);
      console.log('json', jsonString);
      dispatch(loginSuccess(res));
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };
  return {
    // propiedades
    user,
    error,
    loading,
    //metodos
    startLogin,
  };
};
