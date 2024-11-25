// 1. Axios
import axios, { Axios } from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../../helpers/url_helper';
import { Report, CredentialsError, Data, DataRequest, Token, DataCreate } from '../../../interfaces/types/interfaces';


// Obtener informes por codPerfil
export const postResentPin = async (data :DataRequest) : Promise< Data<any> > => {
  try {
    const BaseUrl = KUPIAPI.POST_RESENT_PIN;

    const res = await AxiosWS.post(
      BaseUrl,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      console.error('Error del servidor:', error.response);

      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};

export const postResentPinVoz = async (data :DataRequest) : Promise< Data< any> > => {
  try {
    const BaseUrl = KUPIAPI.POST_RESENT_PIN_VOZ;

    const res = await AxiosWS.post(
      BaseUrl,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    // excepción del axios -> respuesta sea conocida
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      console.error('Error del servidor:', error.response);

      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};