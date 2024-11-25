import { Container, Row } from 'reactstrap';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import { _CreateInvoicerFinView } from './CreateFinancierInvoicer';

export const CreateFinInvoicerView = () => {

  document.title = 'Crear Factura Financiador';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Crear Factura Financiador" />
          <Row>
            <_CreateInvoicerFinView />
          </Row>
        </Container>
      </div>
    </>
  );
};
