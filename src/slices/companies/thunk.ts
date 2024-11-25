// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPrivate, HeadersroutesPublic } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { AssociatedProfile, DataRequest, Company, UserSystem,  CredentialsError, Data } from '../../interfaces/types/interfaces';
import { detailsCompanySuccess } from './reducer';

// Obtener companies
export const getAssociatedProfilesWS = async ( token: string ): Promise<Data<AssociatedProfile[]>> => {
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_ASSOCIATED_PROFILES, // base URL
      { headers: HeadersroutesPrivate(token) } // Complementos
    );

    if (res.status === 200) {
      return res.data;
    }

    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else {
      // un error no determinado
      console.error('Error desconocido', error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const getCompaniesWS = async (): Promise<Data<Company[]>> => {
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_COMPANIES, // base URL
      { headers: HeadersroutesPublic() } // Complementos
    );

    if (res.status === 200) {
      return res.data;
    }

    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else {
      // un error no determinado
      console.error('Error desconocido', error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const getCompanieWS = async (idCompany): Promise<Data<Company[]>> => {
  try {
    const res = await AxiosWS.get(
      `${KUPIAPI.GET_COMPANIES}/${idCompany}`,
      { headers: HeadersroutesPublic() } // Complementos
    );

    if (res.status === 200) {
      return res.data;
    }

    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else {
      // un error no determinado
      console.error('Error desconocido', error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const CompaniesGetUsersWS = async ( data: DataRequest ) : Promise<Data<UserSystem[]>> => {
  try {
    const res = await AxiosWS.post(
      KUPIAPI.GET_COMPANIES_GET_USERS, // base URL
      {},
      { headers: HeadersroutesPrivate( data.token ) } // Complementos
    );

    return res.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CredentialsError(error.response?.data?.message || 'ERROR_IN_YOUR_CREDENTIALS');
    }
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  }
  
};

export const findContractWS = async ( token: string ) : Promise<Data<any>> => {
  try {
    console.log(token);
    const res = await AxiosWS.post(
      KUPIAPI.GET_CONTRACT,
      {},
      { headers: HeadersroutesPrivate( token ) } // Complementos
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CredentialsError(error.response?.data?.message || 'ERROR_IN_YOUR_CREDENTIALS');
    }
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  }
  
};

export const postAccepstContract = async ( token, ipAceptacion, descuesnto ) : Promise<Data<any>> => {
  try {
    const res = await AxiosWS.post(
      KUPIAPI.POST_ACCEPT_CONTRACT, // base URL
      {
        ipAceptacion: ipAceptacion,
        descuento: descuesnto
      },
      { headers: HeadersroutesPrivate( token ) } // Complementos
    );

    return res.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CredentialsError(error.response?.data?.message || 'ERROR_IN_YOUR_CREDENTIALS');
    }
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
  }
  
};

export const getDetailsCompany = idCompany => async dispatch => {
  try {
    const res = await AxiosWS.get(
      `${KUPIAPI.GET_DETAILS_COMMERCE}/${idCompany}`
    );
    // console.log('llega en res de getDeatilsCommere', res.data.data);
    if (res.status === 200) {
      if (res.data.status === true) {
        dispatch(detailsCompanySuccess(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateCommerce = (idCompany, commerce) => async dispatch => {
  try {
    const res = await AxiosWS.put(`${KUPIAPI.UPDATE_COMMERCE}/${idCompany}`, {
      nomEmpresa: commerce.nomEmpresa,
      dirEmpresa: commerce.dirEmpresa,
      desEmpresa: commerce.desEmpresa,
      emaEmpresa: commerce.emaEmpresa,
      telPrincipal: commerce.telPrincipal,
      telEmpresa: commerce.telEmpresa,
      palClaves: commerce.palClaves,
      whatsapp: commerce.whatsapp,
      urlWeb: commerce.urlWeb,
      urlImagen: commerce.urlImagen,
      urlComprar: commerce.urlComprar,
    });
    // console.log('llega en res de updateCommerce', res.data.data);
    if (res.status === 200) {
      if (res.data.status === true) {
        dispatch(detailsCompanySuccess(res.data.data));
      }
    }
  } catch (error) {
    console.log(error);
  }
};
