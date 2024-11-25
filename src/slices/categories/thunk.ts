// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Category, CredentialsError, Data, DataCreate, DataRequest } from '../../interfaces/types/interfaces';

export const getCategoriesWS = async () : Promise< Data<Category[]> > => {
  
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_CATEGORIES,
      { headers: HeadersroutesPublic() }
    );
    
    if (res.status === 200 ) return res.data;
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw new error;
  }
};

// Se comenta ya que no se va a tener el buscador sino que se enlistan todas, por orden de Juan
// export const getcategoriesActivesWS = async () : Promise< Data<Category[]> > => {
  
//   try {
//     const res = await AxiosWS.get(
//       KUPIAPI.GET_CATEGORIES_ACTIVE,
//       { headers: HeadersroutesPublic() }
//     );
    
//     if (res.status === 200 ) return res.data;
    
//     throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

//   } catch (error) {
//     throw new error;
//   }
// };


export const updateCategoryWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_CATEGORIES + "/" + data.params, // base URL
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


export const createCategoryWS = async (data: DataCreate) : Promise< Data<any> > => {

  try {
      console.log("data que llega a thunks", data.bodyOptions)
      const res = await AxiosWS.post(
      KUPIAPI.CREATE_CATEGORIES, // base URL
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
