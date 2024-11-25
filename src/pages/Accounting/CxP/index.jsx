import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { ListCxP } from './ListCxP';

export const AccountsPayable = () => {
  document.title = 'Cuentas por Pagar | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle=" Cuentas por Pagar" />
          <Row>
            <ListCxP />
          </Row>
        </Container>
      </div>
    </>
  );
};
