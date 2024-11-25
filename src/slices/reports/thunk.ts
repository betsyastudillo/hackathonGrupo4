// 1. Axios
import axios, { Axios } from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Report, CredentialsError, Data, DataRequest, Token, DataCreate } from '../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';


// Obtener informes por codPerfil
export const getReportsbyCodPerfilWS = async (data :DataRequest) : Promise< Data< Report[]> > => {
  try {
    const BaseUrl = KUPIAPI.GET_REPORTS_BY_CODPERFIL+"/"+data.params;

    const res = await AxiosWS.get(
      BaseUrl,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) return res.data;
        
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};

export const getReportsLogsTransactions = async (cantidad = 50) : Promise< Data< any> > => {
  try {
    const BaseUrl = KUPIAPI.GET_LOGS_TRANSACTIONS+"?cantidad="+cantidad;

    const res = await AxiosWS.get(
      BaseUrl,
      { headers: HeadersroutesPrivate() }
    );
   
    if (res.status === 200 ) return res.data;
        
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    
  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};


export const getInvoicesComercioWS = async (data :DataRequest ) : Promise< Data< any> > => {
  try {
    const BaseUrl = KUPIAPI.GET_INVOICES_COMERCIO+"/"+ data.params;

    const res = await AxiosWS.get(
      BaseUrl,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    return res.data;

  } catch (error) {
    throw handleAxiosError(error);
  }
};