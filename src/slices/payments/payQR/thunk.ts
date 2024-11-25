// 1. Axios
import axios from 'axios';
import { AxiosWS, HeadersroutesPublic, HeadersroutesPrivate } from '../../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../../helpers/url_helper';
import { CredentialsError, Data, DataCreate } from './../../../interfaces/types/interfaces';

// Obtiene los tipos de documento del usuario
export const regPayQRWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.POST_REG_PAY_QR;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    console.log(error)
    throw new error;
  }
};

// Valida el estado del pago con QR
export const validatePayQRWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.VALIDATE_PAY_QR;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    console.log(error)
    throw new error;
  }
};

// Anula el pago con QR
export const cancelPayQRWS = async ( dataRequest : DataCreate) : Promise< Data<any> > => {

  const baseURl = KUPIAPI.CANCEL_PAY_QR;
  
  try {
    const res = await AxiosWS.post(
      baseURl,
      dataRequest.bodyOptions,
      { headers: HeadersroutesPrivate( dataRequest.token ) } // Complementos
    );
    
    if (res.status === 200 ) {
      return res.data;
    }
    
    throw new CredentialsError('ERROR_IN_YOUR_CREDENTIALS');
    

  } catch (error) {
    console.log(error)
    throw new error;
  }
};

