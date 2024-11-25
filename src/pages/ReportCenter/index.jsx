import { Container, Row } from 'reactstrap';

// Components
import BreadCrumb   from '@/Components/Common/BreadCrumb';
import _myReportsView from './myReports'

export const MyReportsView = () => {
  
  document.title = 'KUPI | Mis Informes';

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Mis Informes"/>
          <Row>
            <_myReportsView />
          </Row>
        </Container>
      </div>
    </>
  );
};