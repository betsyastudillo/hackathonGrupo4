import KUPIICONS from "../common/icons/icons";
import { useNavigate } from "react-router-dom";

export const DynamicIconButtonURL = ( header, row) => {
  console.log("Entramos aqui");

  const navigate = useNavigate(); // Inicializa el hook de navegación
  const IconComponent = KUPIICONS[header.icon];

  if (!IconComponent) {
    console.warn(`Icono "${header.icon}" no encontrado en KUPIICONS.`);
    return null;
  }

  const _handleRoute = () => {
    const firstKey = Object.keys(row)[0]; // Obtiene la primera clave
    const route =  header.url + row[firstKey]; 
    console.log("LA RUTA A LA QUE VAMOS--->", route);
    navigate(route);
  }

  return (
    <div className="action-buttons d-flex justify-content-center">
      <button 
        style={{ borderRadius: '30px', height: '40px', width: '40px', color: "#FFF", border: '1px solid #690BC8' }}
        onClick={_handleRoute}
      >
        <IconComponent fill="#FFF" stroke='#690BC8' height='20' width='20' />
      </button>
    </div>
  );
};
