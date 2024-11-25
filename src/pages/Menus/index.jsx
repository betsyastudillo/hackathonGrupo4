import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { MenuPpal } from './MenuPpal';
import { _SubMenusView } from './Submenus';
import { _MenusAssociatedProfileView } from './MenuAsociatedProfile';

export const Menus = () => {
  document.title = 'Configurar Menú Principal | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Menú Principal"
          />
          <Row>
            <MenuPpal />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const SubMenusView = () => {
  document.title = 'Configurar SubMenús | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" SubMenús"
          />
          <Row>
            <_SubMenusView />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const MenusAssociatedProfileView = () => {
  document.title = 'Menús Asociados | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Menús Asociados"
          />
          <Row>
            <_MenusAssociatedProfileView />
          </Row>
        </Container>
      </div>
    </>
  );
};
