export interface City {
  codCiudad     : number,
  nomCiudad     : string,
  codDepto      : number,
  codDestacado  : number,
  codCiudadDane : string,
}

export interface Department {
  codDepto      : number,
  codDeptoDane  : number,
  nomDepto      : string,
}

export interface CityWithDepartment {
  codCiudad     : number,
  nomCiudad     : string,
  codDepto      : number,
  nomDepto      : number,
}

export interface CityWithKupi {
  codCiudad     : number,
  nomCiudad     : string,
}
