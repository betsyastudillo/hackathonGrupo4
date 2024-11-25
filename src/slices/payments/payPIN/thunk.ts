// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../../helpers/mainRepositoryKupi';

import { KUPIAPI } from '../../../helpers/url_helper';
import { CredentialsError, Data, DataRequest, Token, DataCreate } from './../../../interfaces/types/interfaces';
import { handleAxiosError } from '../../../utilities';

export const regPayPinWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.POST_REG_PAY_PIN;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } 
    );
    
    return res.data;
    
  } catch (error) {
    return handleAxiosError(error);
  }
};


export const resendPinWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.POST_RESENT_PIN;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } 
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    return handleAxiosError(error);
  }
};


export const resendPinVozWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.POST_RESENT_PIN_VOZ;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } 
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    return handleAxiosError(error);
  }
};


export const cancelPayPendingWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {
  
  try {
    const res = await AxiosWS.post(
      KUPIAPI.CANCEL_PAY_PENDING,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } 
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    return handleAxiosError(error);
  }
};


export const doPayPinWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {
  
  try {
    const res = await AxiosWS.post(
      KUPIAPI.DO_PAY_PIN,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } 
    );
    
    return res.data;    

  } catch (error) {
    return handleAxiosError(error);
  }
};
