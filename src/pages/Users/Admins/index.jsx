import { Container, Row } from 'reactstrap';

// Components
import BreadCrumb   from '@/Components/Common/BreadCrumb';
import _adminsSystemView from './adminSystem'

export const AdminsSystemView = () => {
  
  document.title = 'KUPI | Administradores';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb  pageTitle="Perfiles"/>
          <Row>
            <_adminsSystemView />
          </Row>
        </Container>
      </div>
    </>
  );
};