import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ListGiftCards } from './ListGiftCards';

export const GiftCards = () => {
  document.title = 'Listado de GiftCards | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle=" GiftCards" />
          <Row>
            <ListGiftCards />
          </Row>
        </Container>
      </div>
    </>
  );
};
