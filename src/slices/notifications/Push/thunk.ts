// 1. Axios
import { AxiosWS, HeadersroutesPublic } from '../../../helpers/mainRepositoryKupi';
// 2. Llamado a los APis de trabajo
import { KUPIAPI } from '../../../helpers/url_helper';
import { Push, PushUpload, PushUploadDet, CredentialsError, Data, DataRequest, DataCreate } from '../../../interfaces/types/interfaces';
import { handleAxiosError } from '../../../utilities';

// Obtener todos los push 
export const getAllPushWS = async (data: DataRequest) : Promise< Data<Push[]> > => {

  try {
    
    const res = await AxiosWS.get(
      KUPIAPI.GET_ALL_PUSH + "?page=" + data,
      { headers: HeadersroutesPublic(),
        params: { params: data.params }
       } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Obtener push detallado 
export const getPushDetWS = async (data: DataRequest) : Promise< Data<Push[]> > => {

  try {

    const res = await AxiosWS.get(
      KUPIAPI.GET_PUSH_DET + "/" + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Actualizar notificación push 
export const updatePushWS = async (data: DataRequest) : Promise< Data<Push[]> > => {

  try {

    const res = await AxiosWS.put(
      KUPIAPI.GET_PUSH_DET + "?codPush=" + data.params,
      data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Trae la información de los cargues masivos  
export const getPushUploadWS = async () : Promise< Data<PushUpload[]> > => {

  try {

    const res = await AxiosWS.post(
      KUPIAPI.GET_PUSH_UPLOAD,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};


// Trae el total de cargues masivos  
export const countPushUploadDetWS = async (data: DataRequest) : Promise< Data<PushUploadDet[]> > => {

  try {

    const res = await AxiosWS.post(
      KUPIAPI.COUNT_PUSH_UPLOAD_DET + '/' + data.params,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};

// Trae la información detallada de los cargues masivos  
export const getPushUploadDetWS = async (data: DataRequest) : Promise< Data<PushUploadDet[]> > => {

  try {
    console.log("params", data.params)
    console.log("body", data.bodyOptions)
    const res = await AxiosWS.post(
      KUPIAPI.GET_PUSH_UPLOAD_DET + '/' + data.params + '?codEstadoUpload=' + data.bodyOptions,
      { headers: HeadersroutesPublic() } // Complementos
    );
    
    return res.data;
        

  } catch (error) {
    throw handleAxiosError(error)
  }
};

