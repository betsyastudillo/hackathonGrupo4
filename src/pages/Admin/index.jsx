import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { FormEditarComercio } from './FormEditarComercio';

export const EditarComercio = () => {
  document.title = 'Editar Comercio | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Editar Comercio"
          />
          <Row>
            <FormEditarComercio />
          </Row>
        </Container>
      </div>
    </>
  );
};
