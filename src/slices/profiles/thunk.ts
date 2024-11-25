// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Profiles, CredentialsError, Data, DataRequest, Token, DataCreate, Profile } from '../../interfaces/types/interfaces';


// PERFILES
// Obtener los perfiles
export const getProfilesWS = async () : Promise< Data<Profiles[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_ALL_PROFILES, // base URL
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

// Actualizar Perfil
export const updateProfileWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_PROFILES + "?codPerfil=" + data.params, // base URL
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

// Crear Perfil
export const createProfileWS = async (data: DataRequest) : Promise< Data<any> > => {

  try {
    // console.log("Lo que llega de data)")
    const res = await AxiosWS.post(
      KUPIAPI.CREATE_PROFILES, // base URL
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

// perfiles asociados
export const getprofilesAssignWS = async ( codPerfil :string) : Promise< Data<Profile[]> > => {

  const baseURl =KUPIAPI.GET_PROFILES_ASSIGN+"/"+codPerfil;
  
  try {
    const res = await AxiosWS.get(
      baseURl,                           // base URL
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
}

// Obtener todos los perfiles asignados a un usuario
export const getprofilesAssignedbyUserWS = async ( token :string, codUsuario :string) : Promise< Data<Profile[]> > => {

  const baseURl =KUPIAPI.GET_PROFILES_ASSIGNED_BY_USER+"/"+codUsuario;
  console.log("Base URl--->", baseURl);
  try {
    const res = await AxiosWS.get(
      baseURl,                           // base URL
      { headers: HeadersroutesPrivate(token) } // Complementos
    );
    
    if (res.status === 200 ) return res.data;
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.status);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    } else{ // un error no determinado
      console.error("Error desconocido", error);
      throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    }
  }
}

// asignar Perfiles de un usaurio
export const assignProfileWS = async (data: DataRequest) : Promise< Data<any> > => {

  try {
    const res = await AxiosWS.post(
      KUPIAPI.ASSIGN_PROFILE, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.params) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw error; 
  }
};
// remover perfiles de un usuario
export const removeProfileWS = async (data: DataRequest) : Promise< Data<any> > => {

  try {
    const res = await AxiosWS.put(
      KUPIAPI.REMOVE_PROFILE, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.params) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};