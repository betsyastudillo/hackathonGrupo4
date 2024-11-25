// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { AppKupi, AppMarcaCompartida, CredentialsError, Data, DataRequest, DataCreate } from '../../interfaces/types/interfaces';


// APP KUPI
// Obtener la infor de App Kupi
export const getInfoAppKupiWS = async () : Promise< Data<AppKupi[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_APP_KUPI, // base URL
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

// Actualizar Info de App Kupi
export const updateInfoAppKupiWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_APP_KUPI + "/" + data.params, // base URL
      data.bodyOptions,
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

// Crear Info de App Kupi
export const createInfoAppKupiWS = async (data: DataRequest) : Promise< Data<any> > => {

  try {

      const res = await AxiosWS.post(
      KUPIAPI.CREATE_APP_KUPI, // base URL
      data.bodyOptions,
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
      console.error('Error del servidor:', error.response);

      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};


// APP MARCA COMPARTIDA
// Obtener la info de las app de marcas compartidas
export const getAppsMarcaCompWS = async () : Promise< Data<AppMarcaCompartida[]> > => {

  try {
    
    const res = await AxiosWS.get(
      KUPIAPI.GET_APPS_MARCA_COMPARTIDA, // base URL
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


// Obtener la info de las app de marcas compartidas
export const getAppMarcaDetWS = async (data: DataRequest) : Promise< Data<AppMarcaCompartida[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_APP_DET_MARCA_COMPARTIDA + "/" + data.params, // base URL
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


// Actualizar la info de las app de marcas compartidas
export const updateAppMarcaCompWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {
    console.log("Lo que llega al thunks", data.params)
    console.log("Lo que llega al thunks", data.bodyOptions)
    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_APP_MARCA_COMPARTIDA + "/" + data.params, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    console.log(data.bodyOptions)
    console.log(data.params)
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


// Crear la info de las app de marcas compartidas
export const createAppMarcaCompWS = async (data: DataCreate) : Promise< Data<any> > => {

  try {
      const res = await AxiosWS.post(
      KUPIAPI.CREATE_APP_MARCA_COMPARTIDA, // base URL
      data.bodyOptions,
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
      console.error('Error del servidor:', error.response);

      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
};