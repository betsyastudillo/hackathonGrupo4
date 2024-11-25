import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { ListPaymentMeans } from './ListPaymentMeans';


export const PaymentMeans = () => {
  document.title = 'Listado de Medios de Pago | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Medios de Pago"
          />
          <Row>
            <ListPaymentMeans />
          </Row>
        </Container>
      </div>
    </>
  );
};

