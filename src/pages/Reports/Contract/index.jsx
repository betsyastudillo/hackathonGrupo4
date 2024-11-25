import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { _ContractView } from './ContractView';

export const Contract = () => {
  document.title = 'Contrato | Kupi';

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title="Contrato"
            pageTitle=" Informes"
          />
          <Row>
            <_ContractView />
          </Row>
        </Container>
      </div>
    </>
  );
}