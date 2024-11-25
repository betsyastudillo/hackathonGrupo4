import { Container, Row } from 'reactstrap';
import BreadCrumb   from '@/Components/Common/BreadCrumb';
import { _PushNotificationsView } from './PushNotification';
import { _SendMassivePushView } from './SendMassivePush';
import { _DetailsMassivePushView } from './DetailsMassivePush';

export const PushNotificationsView = () => {
  document.title = 'Notificaciones Push | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Notificaciones Push"
          />
          <Row>
            <_PushNotificationsView />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const SendMassivePushView = () => {
  document.title = 'Envío Masivo de Notificaciones Push | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Cargue Masivo"
          />
          <Row>
            <_SendMassivePushView />
          </Row>
        </Container>
      </div>
    </>
  );
};


export const DetailsMassivePushView = () => {
  document.title = 'Detalles de Notificaciones Push | Kupi';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Push enviados"
          />
          <Row>
            <_DetailsMassivePushView />
          </Row>
        </Container>
      </div>
    </>
  );
};