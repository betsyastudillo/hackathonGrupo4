export interface Profile {
  id           : number,
  codPerfil    : number,
  codAutorizado: number,
  ordItem      : number,
  nomPerfil    : string,
}

export interface ProfileExisting {
  apeUsuario  : string,
  codEmpresa  : number,
  codEstado   : number,
  codPerfil   : number,
  codSucursal : number,
  codUsuario  : number,
  fecCreacion : string,
  fecEdicion  : string,
  nomEmpresa  : string
  nomPerfil   : string,
  nomUsuario  : string,
  usrCreacion : number,
  usrEdicion  : number
}
export interface Profiles {
  codPerfil:  number,
  nomPerfil:  string,
  obsPerfil:  string
}
