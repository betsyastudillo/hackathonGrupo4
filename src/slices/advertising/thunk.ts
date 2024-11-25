import { AxiosWS } from '../../helpers/mainRepositoryKupi';
import { KUPIAPI } from '../../helpers/url_helper';
import { setAdvertising } from './reducer';

// Obtener Proveedores SMS
export const getAdvertising = () => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.GET_ADVERTISING, {
      codApp: 0,
      codVersion: 'string',
      codCiudad: 0,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        dispatch(setAdvertising(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Crear PublicidadP
export const createAdvertising = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.CREATE_ADVERTISING, {
      codTipo: data.codTipo,
      categoria: data.categoria,
      codCiudad: data.codCiudad,
      codEmpresa: data.codEmpresa,
      urlLink: data.urlLink,
      imgPromo: data.imgPromo,
      descripcion: data.descripcion || 'Sin Descripción',
      fecPublicaPromo: data.fecPublicaPromo,
      fecExpiraPromo: data.fecExpiraPromo,
      usrRegistra: data.usrRegistra,
      numOrden: data.numOrden,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de create', res.data.data);
        dispatch(getAdvertising());
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Actualizar Publicidad SMS
export const updateAdvertising = data => async dispatch => {
  try {
    const res = await AxiosWS.put(
      `${KUPIAPI.UPDATE_ADVERTISING}/${data.codPromo}`,
      {
        codTipo: data.codTipo,
        categoria: data.categoria,
        codCiudad: data.codCiudad,
        codEmpresa: data.codEmpresa,
        urlLink: data.urlLink,
        imgPromo: data.imgPromo,
        descripcion: data.descripcion || 'Sin Descripción',
        fecPublicaPromo: data.fecPublicaPromo,
        fecExpiraPromo: data.fecExpiraPromo,
        usrRegistra: data.usrRegistra,
        numOrden: data.numOrden,
      }
    );
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de createGiftCard', res.data.data);
        dispatch(getAdvertising());
      }
    }
  } catch (error) {
    console.log(error);
  }
};
