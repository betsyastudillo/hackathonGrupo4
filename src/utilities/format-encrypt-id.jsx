// Función para encriptar en Base64
export const encryptBase64 = (value) => {
  // Asegurarse de que el valor es un string
  const stringValue = typeof value === 'string' ? value : value.toString();

  // Convertir el valor a Base64
  return btoa(stringValue);
};

// Función para desencriptar de Base64
export const decryptBase64 = (base64Value) => {
  try {
    // Desencriptar el valor desde Base64
    return atob(base64Value);
  } catch (error) {
    console.error("Error al desencriptar el valor:", error);
    return null; // O manejar el error de acuerdo a tus necesidades
  }
};

