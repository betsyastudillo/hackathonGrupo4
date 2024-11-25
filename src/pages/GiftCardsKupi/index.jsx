import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ListGiftCardsKupi } from './ListGiftCardsKupi';

export const GiftCardsKupi = () => {
  document.title = 'Listado de Gift Cards Kupi | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle=" Gift Cards Kupi" />
          <Row>
            <ListGiftCardsKupi />
          </Row>
        </Container>
      </div>
    </>
  );
};
