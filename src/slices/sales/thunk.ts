// 1. Axios
import axios, { Axios } from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../helpers/url_helper';
import { Sale, CredentialsError, Data, DataRequest, Token, DataCreate } from '../../interfaces/types/interfaces';
import { handleAxiosError } from '../../utilities';


// Obtener ventas por periodo 
export const getSalesByUserWS = async (data :DataRequest) : Promise< Data< Sale[]> > => {
  try {
    
    const res = await AxiosWS.post(
      KUPIAPI.TRANSACTIONS_HISTORY_SALES_REPORTS,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    return res.data;
  
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getTransactionsGroupByCashierWS = async (data :DataRequest) : Promise< Data< Sale[]> > => {
  try {
    
    const res = await AxiosWS.post(
      KUPIAPI.TRANSACTIONS_GROUP_BY_CASHIER,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};

export const getTransactionDetailCashierWS = async (numTransaction : number, token : String) : Promise< Data< any> > => {
  try {
    
    const res = await AxiosWS.get(
      `${KUPIAPI.TRANSACTION_HISTORY_DETAIL_CASHIER}/${numTransaction}`,
      { headers: HeadersroutesPrivate(token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};

export const getcxpComercioWS = async (data :DataRequest) : Promise< Data< Sale[]> > => {
  try {
    
    const res = await AxiosWS.post(
      KUPIAPI.GET_CXP_COMERCIO,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};


export const skeletonWS = async (data :DataRequest, url: string) : Promise< Data< any[]> > => {
  try {

    const res = await AxiosWS.post(
      url,
      data.bodyOptions,
      { headers: HeadersroutesPrivate(data.token) }
    );
   
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    throw error; // Lanza el error original sin envoltura
  }
};