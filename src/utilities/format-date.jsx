export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Fecha inválida");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JS son 0 indexados
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Si las horas y minutos son diferentes de 00:00, los agregamos al resultado
    const timePart = (hours !== 0 || minutes !== 0)
      ? ` ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      : '';

    return `${year}-${month}-${day}${timePart}`;
  } catch (error) {
    console.error("Error al formatear la fecha:", error);
    return null;
  }
};

export const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
}; 

