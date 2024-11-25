import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { _LogTransactionsView } from './LogTransactions';

export const LogsTransactions = () => {
  document.title = 'Log Transacciones | Kupi';

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle=" Informes"
          />
          <Row>
            <_LogTransactionsView />
          </Row>
        </Container>
      </div>
    </>
  );
}