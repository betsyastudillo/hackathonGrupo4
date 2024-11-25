import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { GenerarPagoQR }  from './GenerarPagoQR';
import { PaymentLink } from './PaymentLink';
import { CheckUserBalance } from './CheckUserBalance';
import { PagosView } from './components/Pagos';

import './style/index.scss';

export const PagoPIN = () => {
  document.title = 'Pago con PIN (SMS) | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Pago con PIN" />
          <Row>
            <PagosView
              typePayment={0}
            />
          </Row>
        </Container>
      </div>
    </>
  );
};

export const PagoQR = () => {
  document.title = 'Pago con QR (App) | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Pago con QR" />
          <Row>
            <GenerarPagoQR />
          </Row>
        </Container>
      </div>
    </>
  );
};

// Retiro Efectivo
export const WithdrawalCash = () => {
  document.title = 'Retirar Efectivo | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Retirar Efectivo"/>
          <Row>
            <PagosView
              title='Retiro de Efectivo'
              btnText='Generar Retiro'
              title2='Generar Retiro por Pin (SMS)'
              typePayment={1}
            />
            {/* <WithdrawCash/> */}
          </Row>
        </Container>
      </div>
    </>
  );
};

// Generar Link De Pago
export const PaymentLinks = () => {
  document.title = 'Generar Link de Pago | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Link de Pago"
          />
          <Row>
            <PaymentLink />
          </Row>
        </Container>
      </div>
    </>
  );
};

// Consultar Saldo Usuario
export const CheckingUserBalance = () => {
  document.title = 'Consultar saldo usuario | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Consultar saldo usuario"
          />
          <Row>
            <CheckUserBalance />
          </Row>
        </Container>
      </div>
    </>
  );
};
