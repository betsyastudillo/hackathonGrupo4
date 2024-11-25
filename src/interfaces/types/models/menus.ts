export interface Submenus {
  id:  number,
  nomSubmenu:  string,
  ordItem:  number,
  urlReact:  string,
  codMenuPrincipal:  number,
  visible: number
}

export interface Menus {
  id       : number,
  ordItem  : number,
  nomMenu  : string,
  iconoMenu: string,
  colorMenu: string,
  urlReact : string,
  submenus : Submenus,
}


export interface MenusAssociated {
  codPerfil: number,
  idSubmenu: number,
  nomSubmenu: string,
  ordSubmenu: number,
  urlSubmenu: string,
  codMenuPrincipal: number,
  nomMenu : string,
}


export interface Token {
  token  : string,
}