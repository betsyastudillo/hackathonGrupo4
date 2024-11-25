import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ParametrizacionesAppKupi } from './ParameterizationAppKupi';
import { ListadoAppsMarcasComp } from './ListadoAppsMarcasComp';
import { ParameterizationAppsMarcasComp } from './ParameterizationAppsMarcasComp';


export const AppKupi = () => {
  document.title = 'Información App Kupi | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Parametrización App Kupi"
          />
          <Row>
            <ParametrizacionesAppKupi />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const ListAppsMarcasCompartidas = () => {
  document.title = 'Apps Marcas Compartidas | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Apps Marcas Compartidas"
          />
          <Row>
            <ListadoAppsMarcasComp />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const DetailsAppsMarcasCompartidas = () => {
  document.title = 'Apps Marcas Compartidas | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Parametrización App"
          />
          <Row>
            <ParameterizationAppsMarcasComp />
          </Row>
        </Container>
      </div>
    </>
  );
};

