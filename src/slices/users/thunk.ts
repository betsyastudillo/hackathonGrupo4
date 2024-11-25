// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Users, UserFinancier, CredentialsError, Data, DataRequest, Token, DataCreate } from '../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';

export const KupiloginWS = async(data :DataRequest) : Promise< Data <any> > => {
  try {
    console.group("entro Aqui con data--->", data);
    const res = await AxiosWS.post(
      KUPIAPI.LOGIN_USER, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPublic() }
    );
    
    if (res.status === 200 ) return res.data;
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw new error;
  }
}

export const findUsersByDocumentWS = async ( token :string, searchingUser :string) : Promise< Data<Users[]> > => {

  const baseURl =KUPIAPI.GET_USERS_FIND_BY_DOCUMENT+"/"+searchingUser;
  
  try {
    const res = await AxiosWS.get(
      baseURl, // base URL
      { headers: HeadersroutesPrivate(token) } // Complementos
    );
    
    if (res.status === 200 ) {
      // console.log(res.data);
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const getUserByDocumentWS = async ( searchingUser :string) : Promise< Data<Users> > => {
  const baseURl =KUPIAPI.GET_USER_BY_DOCUMENT+"/"+searchingUser;
  
  try {
    const res = await AxiosWS.get(
      baseURl,
      { headers: HeadersroutesPublic() } 
    );
    
    if (res.status === 200 ) return res.data;
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw error;
  }
};

export const getFCMTokenByDocumentWS = async ( searchingUser :string) : Promise< Data<Users> > => {
  const baseURl =KUPIAPI.GET_FCM_BY_DOCUMENT+"/"+searchingUser;
  
  try {
    const res = await AxiosWS.get(
      baseURl,
      { headers: HeadersroutesPublic() } 
    );
    
    if (res.status === 200 ) return res.data;
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw error;
  }
};

export const createAdminUserWS= async ( dataRequest :DataRequest) : Promise< Data<any> > => {
  
  try {
    const res = await AxiosWS.post(
      KUPIAPI.CREATE_ADMIN_USER,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate(dataRequest.token) } 
    );
    
    return res.data;

  } catch (error) {
    throw handleAxiosError(error);
  }
};


export const findUserByIdtWS = async ( token :string, codUser :string) : Promise< Data<Users> > => {

  const baseURl =KUPIAPI.GET_USER_FIND_BY_ID+"/"+codUser;
  
  try {
    const res = await AxiosWS.get(
      baseURl, // base URL
      { headers: HeadersroutesPrivate(token) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const updateProfile = async ( token : string, codGenero: string, codCiudad: string, fecNacimiento: string ) : Promise< Data<any> > => {
  const baseURl =KUPIAPI.UPDATE_PROFILE_USER;
  try {
    const bodyOptions = {
      codGenero: codGenero,
      codCiudad: codCiudad,
      fecNacimiento: fecNacimiento
    };
    const res = await AxiosWS.put(
      baseURl, // base URL
      bodyOptions,
      { headers: HeadersroutesPrivate(token) }
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const changePassword = async ( token : string, passOld: string, passNew: string ) : Promise< Data<any> > => {
  const baseURl = KUPIAPI.CHAGE_PASSWORD;
  try {
    const bodyOptions = {
      passOld: passOld,
      passNew: passNew,
    };
    const res = await AxiosWS.put(
      baseURl, // base URL
      bodyOptions,
      { headers: HeadersroutesPrivate(token) }
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

// Obtiene los tipos de documento del usuario
export const getDocumentTypesWS = async () : Promise< Data<Users> > => {

  const baseURl =KUPIAPI.GET_USER_DOCUMENTS_TYPE;
  
  try {
    const res = await AxiosWS.get(
      baseURl, // base URL
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

// Consultar saldo del usuario
export const notificateBalanceUserWS = async ( token : string, dataToSend: any ) : Promise< Data<Users> > => {

  const baseURl =KUPIAPI.NOTIFICATE_BALANCES_USER;
  
  try {
    const res = await AxiosWS.post(
      baseURl, // base URL
      dataToSend,
      { headers: HeadersroutesPrivate(token) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

// FINANCIADORA
export const getUserByFinancier = async (data: DataRequest) : Promise< Data<UserFinancier> > => {

  const baseURl =KUPIAPI.GET_USERS_BY_FINANCER + '/' + data.params;

  try {
    const res = await AxiosWS.get(
      baseURl, // base URL
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
    
  } catch (error) {
    throw handleAxiosError(error)
  }
};


export const createUserByFinancier = async (data: DataRequest) : Promise< Data<UserFinancier> > => {

  const baseURl =KUPIAPI.CREATE_USER_BY_FINANCIER;
  console.log("token", data.token)
  console.log("data que llega", data.bodyOptions)
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
