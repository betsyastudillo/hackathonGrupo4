import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

export const UserView = () => {
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title="Lista de usuarios"
            pageTitle="Lista de Usuarios"
          />
          {/* <Row>
            <AgregarMenuPpal />
          </Row> */}
        </Container>
      </div>
    </>
  );
};
