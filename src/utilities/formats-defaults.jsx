
// utils/errorHandler.ts
import axios from 'axios';

export const defaultUser = {
  apeUsuario   : "", 
  clvUsuario   : "",
  codCiudad    :  0,
  codCupo      :  0,
  codEstado    :  0,
  codFinancia  :  0,
  codGenero    :  0,
  codUsuario   :  0,
  cupoAsignado :  0,
  dirUsuario   : "",
  emaUsuario   : "",
  fecNacimiento: "",
  nomUsuario   : "",
  numDocumento : "",
  resetOTP     : "",
  telUsuario   : "",
  tipoDocumento: "",
  urlIcon      : "",   
  valBono      :  0,
  valCupo      :  0,
  valPasacupo  :  0
}

export const toastDefault = {  
  title  : "",   
  message: "",  
  type   : "success",   
  isVisible: false 
};

export const formPinDefault = {
  valor: '',
  referencia: '',
  cedula: '',
}

export const defaultGiftCardKupi = {
  id: '',
  uuid: '',
  nomTarjeta: '',
  descripcion: '',
  claseBono: '',
  bgColor: '',
  background: '',
  usrCreacion: '',
  fechaCreacion: '',
  usrEdicion : '',
  fechaEdicion: '',
  orden: '',
  codEstado: 1,
}

export const handleAxiosError = (error) => {
  if (axios.isAxiosError(error)) {
    throw {
      status: error.response?.status,
      data: error.response?.data
    };
  }

  // Para otros tipos de errores
  throw new Error(error);
};

