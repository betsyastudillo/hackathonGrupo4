export const formatBool = (dateBool) => {
  try {
    if ( dateBool == 1 ) return "Si";
    else return "No";
  } catch (error) {
    console.error("Error al formatear el dateBool:", error);
    return "No";
  }
};



