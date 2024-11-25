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
  Data,
  DataRequest,
  Token,
  DataCreate,
  CityWithDepartment,
} from '../../interfaces/types/interfaces';

// LOCATIONS
// Obtener las ciudades con el nombre del departamento
export const getCitiesWithDeptoWS = async (): Promise<
  Data<CityWithDepartment[]>
> => {
  try {
    const res = await AxiosWS.get(
      KUPIAPI.GET_CITIES_WITH_DEPARTMENTS, // base URL
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
