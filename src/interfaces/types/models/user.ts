export interface User {
  userID        : string;
  userName      : string;
  userLastName  : string;
  exp           : string;

  codUsuario    : string;
  codEmpresa    : string;
  nomUsuario    : string;
  apeUsuario    : string;
  numDocumento  : string;
  
  codPerfil     : number;
  // WS
  token: string;
}

export interface Users {
  apeUsuario : string;
  clvUsuario : string;
  codCiudad  : number;
  codCupo    : number;
  codEstado : number;
  codFinancia : number;
  codGenero : number;
  codUsuario : number;
  cupoAsignado : number;
  dirUsuario : string ;
  emaUsuario : string ;
  fecNacimiento : string ;
  nomUsuario : string ;
  numDocumento : string;
  resetOTP : string;
  telUsuario : string;
  tipoDocumento : string;
  urlIcon : string;
  valBono : string;
  valCupo : string;
  valPasacupo : string;
}

export interface UserFinancier {
  // codUsuario: number;
  // codFinancia: number;
  // telUsuario: string;
  // emaUsuario: string;
  // valBono: number;
  // valCupo: number;
  valPasaCupo: number;
  // numDocumento: string;
  // nomCompleto: string;
  codCupo: number;
  valCupoAsignado: number;
  valCodCupo: number;
}