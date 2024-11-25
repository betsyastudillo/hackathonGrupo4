import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Container, Row } from 'reactstrap';
import { FormEnviarSMS } from './FormEnviarSMS';

export const SendSMS = () => {
  document.title = 'Enviar SMS | Kupi Comercios';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title="Enviar SMS"
            pageTitle="Enviar SMS"
          />
          <Row>
            <FormEnviarSMS />
          </Row>
        </Container>
      </div>
    </>
  );
};
