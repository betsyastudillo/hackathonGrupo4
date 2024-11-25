import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ListProfiles } from './ListProfiles';


export const Profiles = () => {
  document.title = 'Listado de Perfiles | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Perfiles"
          />
          <Row>
            <ListProfiles />
          </Row>
        </Container>
      </div>
    </>
  );
};

