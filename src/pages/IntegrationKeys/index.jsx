import { Container, Row } from 'reactstrap';
import BreadCrumb   from '@/Components/Common/BreadCrumb';
import { _IntegrationKeysView } from './IntegrationKey';

export const IntegrationKeysView = () => {
  document.title = 'Llaves de Integración | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Llaves de Integración"
          />
          <Row>
            <_IntegrationKeysView />
          </Row>
        </Container>
      </div>
    </>
  );
};