import { Container, Row } from 'reactstrap';
import BreadCrumb         from '@/Components/Common/BreadCrumb';
import _BonosView         from './Bonos';

export const BonosView = () => {

  document.title = 'Clase Bonos';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Clase Bonos" />
          <Row>
            <_BonosView />
          </Row>
        </Container>
      </div>
    </>
  );
};
