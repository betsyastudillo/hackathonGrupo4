export interface Sale {
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