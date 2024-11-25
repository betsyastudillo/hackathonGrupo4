import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { ListUsersFinancer } from './ListUsersFinancer';


export const ListUserFinancier = () => {
  document.title = 'Listado de Usuarios | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Lista de Usuarios"
          />
          <Row>
            <ListUsersFinancer />
          </Row>
        </Container>
      </div>
    </>
  );
};

