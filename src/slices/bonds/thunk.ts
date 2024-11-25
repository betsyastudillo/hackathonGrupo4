// 1. Axios
import axios from 'axios';
import {
  AxiosWS,
  HeadersroutesPublic,
  HeadersroutesPrivate,
} from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import {
  CredentialsError,
  UserFinancier,
  Data,
  DataRequest,
  Token,
} from './../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';


// Obtiene las clases de Bonos del sistema
export const getClassesBondsWS = async (token: Token): Promise<Data<any>> => {
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_CLASSES_BONDS,
      { headers: HeadersroutesPrivate(token) } // Complementos
    );

    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};


// OBSEQUIAR BONOS
export const getLatestBondsWS = async (data: DataRequest): Promise<Data<any>> => {
  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_LATEST_BONDS + '/' + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );

    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};


// Trae la información básica del usuario a asignar bono
export const getInfoUserWS = async (data: DataRequest): Promise<Data<any>> => {
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_INFO_USER_FOR_ASSIGN_BOND + '/' + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );

    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};


// Trae los tipos de bono por codEmpresa
export const getClassBondsForCodEmpresaWS = async (data: DataRequest): Promise<Data<any>> => {
  try {
    console.log("thunk, toke", data.token)
    const res = await AxiosWS.get(
      KUPIAPI.GET_CLASSES_BONDS_FOR_CODEMPRESA + '/' + data.params,
      { headers: HeadersroutesPrivate(data.token) } // Complementos
    );

    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

// Crea el usuario 
export const createUserByFinancier = async (data: DataRequest): Promise<Data<UserFinancier>> => {

  const baseURl =KUPIAPI.CREATE_USER_BY_FINANCIER;
  try {
    const res = await AxiosWS.post(
      baseURl, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) } // Complementos
    );
    
    return res.data;
    
  } catch (error) {
    throw handleAxiosError(error)
  }
};