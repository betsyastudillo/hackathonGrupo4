import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
import { KUPIAPI } from '../../helpers/url_helper';
// import { setAdvertising } from './reducer';
import { Data, DataCreate, DataRequest } from './../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';

// Obtener las Cuentas por Pagar a Comercios
export const getAccountsPayable = () => async dispatch => {
  try {
    const res = await AxiosWS.get(KUPIAPI.GET_ACCOUNTSPAYABLE);
    if (res.status === 200) {
      if (res.data.status === true) {
        // console.log('llega en cxp', res.data.data);
        return res.data.data;
        // dispatch(setAdvertising(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Trae las financiadoras
export const getAllFinanciersWS = async (): Promise<Data<any>> => {
  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_FINANCIERS,
      { headers: HeadersroutesPublic() } // Complementos
    );

    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};


// Crea factura de una financiadora
// export const getAllFinanciersWS = async (): Promise<Data<any>> => {
//   try {

//     const res = await AxiosWS.get(
//       KUPIAPI.GET_FINANCIERS,
//       { headers: HeadersroutesPublic() } // Complementos
//     );

//     return res.data;
//   } catch (error) {
//     return handleAxiosError(error);
//   }
// };