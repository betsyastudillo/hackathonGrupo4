import { AxiosWS } from '../../helpers/mainRepositoryKupi';
import { KUPIAPI } from '../../helpers/url_helper';
import { setProvidersSMS } from './reducer';

// Enviar SMS
export const enviarSMS = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.SEND_SMS, {
      number: data.telefono,
      text: data.mensaje,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de enviarSMS', res.data.data);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Obtener Proveedores SMS
export const getProvidersSMS = () => async dispatch => {
  try {
    const res = await AxiosWS.get(KUPIAPI.GET_PROVIDERS_SMS);
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de getDeatilsCommere', res.data.data);
        dispatch(setProvidersSMS(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Crear Proveedores SMS
export const createProviderSMS = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.CREATE_PROVIDERS_SMS, {
      proveedor: data.proveedor,
      funcion: data.funcion,
      orden: data.orden,
      codEstado: data.codEstado,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res', res.data.data);
        dispatch(getProvidersSMS());
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Actualizar Proveedores SMS
export const updateProviderSMS = data => async dispatch => {
  try {
    const res = await AxiosWS.put(
      `${KUPIAPI.UPDATE_PROVIDERS_SMS}?id=${data.id}`,
      {
        proveedor: data.proveedor,
        orden: data.orden,
        codEstado: data.codEstado,
      }
    );
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res', res.data.data);
        dispatch(getProvidersSMS());
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendPush = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.SEND_PUSH, {
      fcm_token: data.fcm_token,
      title: data.title,
      message: data.message,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de enviarPUSH', res.data.data);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
