export const formatTipoPago = (data) => {
  switch (data) {
    case 1:
      return 'Cupo';
    case 2:
      return 'Bono';
    case 3:
      return 'Pasacupo';
    case 4:
      return 'Recarga saldo';
    case 5:
      return 'Retiro';
    case 6:
      return 'Reverso';
    case 7:
      return 'Transferencia';
    case 8:
      return 'Prescripción'
    default:
      return 'Bono';
  }
};
