import { Container, Row } from 'reactstrap';

import BreadCrumb from '../../../Components/Common/BreadCrumb';
import _UsersView from './Users'

export const UsersView = () => {
  
  document.title = 'Usuarios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Lista de Usuarios"
          />
          <Row>
            <_UsersView />
          </Row>
        </Container>
      </div>
    </>
  );
};