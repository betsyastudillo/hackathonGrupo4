// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Tokens, CredentialsError, Data, DataRequest, DataCreate } from '../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';


// Obtener todos las llaves de integración por codEmpresa 
export const getTokensByCodEmpresaWS = async (data: DataRequest) : Promise< Data<Tokens[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_TOKENS_BY_CODEMPRESA + "/" + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Crear las llaves de integración
export const createTokensWS = async (data: DataCreate) : Promise< Data<Tokens[]> > => {

  try {
    console.log('URL de la API:', KUPIAPI.CREATE_TOKENS);
    console.log("llega a thunks", data.bodyOptions)
    const res = await AxiosWS.post(
      KUPIAPI.CREATE_TOKENS,
      data.bodyOptions,
      { headers: HeadersroutesPrivate( data.token ) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    return handleAxiosError(error);
  }
};

// Crear las llaves de integración
export const getTypeTokensWS = async () : Promise< Data<Tokens[]> > => {

  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_TYPE_TOKENS,
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
