// 1. Axios
import { AxiosWS, HeadersroutesPublic } from '../../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../../helpers/url_helper';
import { PaymentsMeans, CredentialsError, Data, DataRequest, DataCreate } from '../../../interfaces/types/interfaces';
import { handleAxiosError } from '../../../utilities';

// Obtener todos los medios de pago (con codEstado 1) 
export const getAllPaymentsMeansWS = async () : Promise< Data<PaymentsMeans[]> > => {

  try {
    
    const res = await AxiosWS.get(
      KUPIAPI.GET_PAYMENTS_MEANS_EXT ,
      { headers: HeadersroutesPublic()} // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Obtiene un medio de pago
export const getPaymentMeansDetWS = async (data: DataRequest) : Promise< Data<PaymentsMeans[]> > => {

  try {
    
    const res = await AxiosWS.get(
      KUPIAPI.GET_PAYMENT_MEAN_DET + "/" + data,
      { headers: HeadersroutesPublic(),
        params: { params: data.params }
       } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Crear un medio de pago 
export const createPaymentMeansWS = async (data: DataCreate) : Promise< Data<PaymentsMeans[]> > => {

  try {
    const res = await AxiosWS.post(
      KUPIAPI.CREATE_PAYMENT_MEAN,
      data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Actualizar medio de pago 
export const updatePaymentMeansWS = async (data: DataRequest) : Promise< Data<PaymentsMeans[]> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.UPDATE_PAYMENT_MEAN + "?id=" + data.params,
      data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Eliminar medio de pago 
export const deletePaymentMeansWS = async (data: DataRequest) : Promise< Data<PaymentsMeans[]> > => {

  try {

    const res = await AxiosWS.delete(
      KUPIAPI.DELETE_PAYMENT_MEAN + "?id=" + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};

