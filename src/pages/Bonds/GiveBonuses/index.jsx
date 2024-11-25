import { Container, Row } from 'reactstrap';
import BreadCrumb from '@/Components/Common/BreadCrumb';
import { _GiveBonusView } from './GiveBonus';
import { _AssignBonusView } from './AssignBonus';
import { _CreateUserView } from './CreateUser';

export const GiveBonusView = () => {

  document.title = 'Obsequiar Bono';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Obsequiar Bono" />
          <Row>
            <_GiveBonusView />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const AssignBonusViews = () => {

  document.title = 'Asignar Bono';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Asignar Bono" />
          <Row>
            <_AssignBonusView />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const CreateUserViews = () => {

  document.title = 'Crear Usuario';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Crear Usuario" />
          <Row>
            <_CreateUserView />
          </Row>
        </Container>
      </div>
    </>
  );
};
