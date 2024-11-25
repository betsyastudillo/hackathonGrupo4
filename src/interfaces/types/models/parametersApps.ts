import { NumberSchema } from "yup"

export interface AppKupi {
  id: number,
  llave: string,
  valor: string,
}

// export interface AppMarcaReducida {
//   codApp: number,
//   nomApp: string,
//   codEmpresa: number,
// }

export interface AppMarcaCompartida {
  codApp: number,
  nomApp: string,
  codEmpresa: number,
  imgLogo: string,
  imgHead: string,
  colApp1: string,
  colApp2: string,
  colApp3: string,
  colApp4: string,
  colApp5: string,
  colApp6: string,
  colApp1Nuevo: string,
  colApp2Nuevo: string,
  colApp3Nuevo: string,
  colApp4Nuevo: string,
  colApp5Nuevo: string,
  colApp6Nuevo: string,
  retiroSaldo: number,
  campo2: string,
  campo3: string,
  campo4: string,
  campo5: string,
  compromisos: number,
  soat: number,
  pasacupo: number,
  recargas: number,
  suscripciones: number,
  paquetes: number,
  usrCreacion: number,
  fecCreacion: Date,
  usrEdicion: number,
  fecEdicion: Date,
  registrar: number,
  url_tyc: string,
  url_ptd: string,
  linea_purpura: string,
  soporte_tel: string,
  soporte_whatsapp: string
}
