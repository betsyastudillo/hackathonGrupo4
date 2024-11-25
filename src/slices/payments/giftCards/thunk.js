import { AxiosWS } from '../../../helpers/mainRepositoryKupi';
import { KUPIAPI } from '../../../helpers/url_helper';
import {
  setGiftCards,
  setListPricesGiftCards,
  setGiftCardsKupi,
  setListPricesKupiKards,
} from './reducer';

// Obtener las GiftCards
export const getGiftCards = () => async dispatch => {
  try {
    const res = await AxiosWS.get(KUPIAPI.GET_GIFTCARDS);
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de getGiftCards', res.data.data);
        dispatch(setGiftCards(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Actualizar GiftCards
export const updateGiftCard = data => async dispatch => {
  try {
    const res = await AxiosWS.put(KUPIAPI.UPDATE_GIFTCARDS, {
      codGrupo: data.codGrupo,
      nomPin: data.nomPin,
      desPin: data.desPin,
      bgColor: data.bgColor,
      urlImagen: data.urlImagen,
      numOrden: data.numOrden,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de createGiftCard', res.data.data);
        dispatch(getGiftCards());
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Obtener la lista de precios de las GiftCards
export const getListPricesGiftCards = data => async dispatch => {
  console.log('llega en data listpricegifstcards', data);
  try {
    const res = await AxiosWS.post(KUPIAPI.GET_LIST_PRICES_GIFTCARDS, {
      codGrupo: +data.codGrupo,
      funcion: '',
    });
    console.log('llega en res', res);
    if (res.status === 200) {
      // if (res.data.status === true) {
      console.log('llega en res de getListPricesGiftCards', res.data.data);
      dispatch(setListPricesGiftCards(res.data.data));
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

// Obtener las GiftCardsKupi
export const getGiftCardsKupi = () => async dispatch => {
  try {
    const res = await AxiosWS.get(KUPIAPI.GET_GIFTCARDS_KUPI);
    if (res.status === 200) {
      if (res.data.status === true) {
        console.log('llega en res de getGiftCardsKupi', res.data.data);
        dispatch(setGiftCardsKupi(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Crear GiftCardsKupi
export const createGiftCardKupi = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.CREATE_GIFTCARDS_KUPI, {
      nomTarjeta: data.nomTarjeta,
      descripcion: data.descripcion,
      claseBono: data.claseBono,
      bgColor: data.bgColor,
      background: data.background,
      orden: data.orden,
      usrCreacion: data.usrCreacion,
      codEstado: data.codEstado
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de createGiftCard', res.data.data);
        dispatch(setGiftCardsKupi(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Actualizar GiftCardsKupi
export const updateGiftCardKupi = data => async dispatch => {
  try {
    const res = await AxiosWS.put(KUPIAPI.UPDATE_GIFTCARDS_KUPI, {
      id: data.id,
      nomTarjeta: data.nomTarjeta,
      descripcion: data.descripcion,
      claseBono: data.claseBono,
      bgColor: data.bgColor,
      background: data.background,
      orden: data.orden,
      usrEdicion: data.usrCreacion,
      codEstado: data.codEstado
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        dispatch(getGiftCardsKupi());
        return true;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Obtener la lista de precios de las KupiKards
export const getListPricesKupiKards = idCard => async dispatch => {
  try {
    const res = await AxiosWS.get(
      `${KUPIAPI.GET_LIST_PRICES_KUPIKARDS}/${idCard}`
    );
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de getListPricesKupiKards', res.data.data);
        dispatch(setListPricesKupiKards(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Crear Precio de KupiKard
export const createPriceKupiKard = data => async dispatch => {
  try {
    const res = await AxiosWS.post(KUPIAPI.CREATE_PRICES_KUPIKARDS, {
      codGiftCardKupi: data.codGiftCardKupi,
      valor: data.valor,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de createGiftCard', res.data.data);
        dispatch(getListPricesKupiKards(data.codGiftCardKupi));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Actualizar Precio de KupiKard
export const updatePriceKupiKard = data => async dispatch => {
  try {
    const res = await AxiosWS.put(KUPIAPI.UPDATE_PRICES_KUPIKARDS, {
      id: data.id,
      valor: data.valor,
    });
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en res de createGiftCard', res.data.data);
        dispatch(getListPricesKupiKards(data.codGiftCardKupi));
      }
    }
  } catch (error) {
    console.log(error);
  }
};
