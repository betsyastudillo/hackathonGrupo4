// Función para formatear saldo en formato COP
export const formatSaldoCOP = (saldo) => {
  // Convertir el saldo a número, manejando casos en que sea un string
  const numericSaldo = typeof saldo === 'string' ? parseFloat(saldo) : saldo;

  // Verificar que el valor sea un número válido
  if (isNaN(numericSaldo)) {
    return '0 COP'; // O un mensaje de error adecuado
  }

  // Formatear el número a formato COP
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Ajusta según sea necesario
  }).format(numericSaldo);
};
