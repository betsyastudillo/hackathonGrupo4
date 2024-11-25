export interface AssociatedProfile {
  nomPerfil : string,
  codPerfil : number,
  codEmpresa: number,
  nomEmpresa: string,
  autCobrar : string
}


export interface Company {  
  agrupado      : number
  codBanco      : number
  codCiudad     :  string
  codEmpresa    : number
  codEstado     : number
  codPrincipal  : number
  codTipCuenta  : number
  codTipPersona : number
  codVisible    : number
  dirEmpresa    : string,
  latEmpresa    : string,
  lonEmpresa    : string,
  nitEmpresa    : string,
  nomEmpresa    : string,
  nomGrupo      : string,
  numCuenta     : string,
  numDocTitular : string,
  razonSocial   : string,
  telEmpresa    : string,
  telPrincipal  : string,
  titCuenta     : string,
  urlIcon       : string,
  urlImagen     : string,
  urlWeb        : string,
  whatsapp      : string
}

export interface UserSystem {
  codUsuario    : number,
  nomUsuario    : string,
  apeUsuario    : string,
  numDocumento  : number,
  urlIcon       : string,
  codPerfil     : number,
  nomPerfil     : string
}