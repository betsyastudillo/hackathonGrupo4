// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Menus, Submenus, MenusAssociated, CredentialsError, Data, DataRequest, Token, DataCreate } from '../../interfaces/types/interfaces';

// Reset JWT
export const resetJWTweb = async (codPerfil: number, codEmpresa: number, token : string) : Promise< Data<Token> > => {

  // console.log("que llego codPerfil", codPerfil)
  // console.log("que llego codEmpresa", codEmpresa)
  // console.log("que llego token", token)
  // console.log("KUPIAPI.GET_RESET_JWT_WEB,", KUPIAPI.GET_RESET_JWT_WEB,)
  try {
    const bodyOptions = {
      codEmpresa: codEmpresa,
      codPerfil: codPerfil
    };
    const res = await AxiosWS.post(
      KUPIAPI.GET_RESET_JWT_WEB, // base URL
      bodyOptions,
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

// Obtener companies 
export const fetchMenusProfileWS = async (codUsuario: number, codEmpresa: number) : Promise< Data<Menus[]> > => {

  try {
    const bodyOptions = {
      codUsuario: codUsuario,
      codEmpresa: codEmpresa
    };
    const res = await AxiosWS.post(
      KUPIAPI.GET_MENUS, // base URL
      bodyOptions,
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


// MENÚ PRINCIPAL
// Obtener Menú Principales 
export const getMenusPpalWS = async () : Promise< Data<Menus[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_MENUS_PPAL, // base URL
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

// Actualizar Menú Principal 
export const updateMenusPpalWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_MENU_PPAL + "/" + data.params, // base URL
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

// Crear Menú Principal 
export const createMenusPpalWS = async (data: DataCreate ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.post(
      KUPIAPI.CREATE_MENU_PPAL, // base URL
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

// SUBMENUS
// Obtener Submenú 
export const getSubmenusWS = async (data: DataRequest) : Promise< Data<Submenus[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_SUBMENUS + "/" + data.params, // base URL
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

// Actualizar Submenú 
export const updateSubmenuWS = async (data: DataRequest ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_SUBMENUS + "/" + data.params, // base URL
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

// Crear Submenú
export const createSubmenuWS = async (data: DataCreate ) : Promise< Data<any> > => {

  try {

    const res = await AxiosWS.post(
      KUPIAPI.CREATE_SUBMENUS, // base URL
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


// Menús Asociados a Perfiles
export const getMenusAssociatedWS = async (data: DataRequest) : Promise< Data<MenusAssociated[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_MENUS_ASSOCIATED + "/" + data.params, // base URL
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


// Obtener todos los submenú 
export const getAllSubmenusWS = async () : Promise< Data<MenusAssociated[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.ALL_SUBMENUS, // base URL
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


// Agregar un Submenú 
export const addSubmenusWS = async (data: DataCreate) : Promise< Data<MenusAssociated[]> > => {

  try {

    const res = await AxiosWS.post(
      KUPIAPI.ADD_SUBMENUS, // base URL
      data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    if (res.status === 200 ) {

      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error;
  }
};


// Eliminar un Submenú 
export const deleteSubmenusWS = async (id: number) : Promise< Data<any> > => {

  try {
    console.log("id", id)
    const res = await AxiosWS.delete(
      KUPIAPI.DELETE_SUBMENUS + "/" + id, // base URL
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
