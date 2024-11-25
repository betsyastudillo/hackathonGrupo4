import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ListAdvertising } from './ListAdvertising';

export const Advertising = () => {
  document.title = 'Lista de Publicidad | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle=" Publicidad" />
          <Row>
            <ListAdvertising />
          </Row>
        </Container>
      </div>
    </>
  );
};
