import { Container, Row } from 'reactstrap';
import BreadCrumb   from '@/Components/Common/BreadCrumb';
import { useParams } from 'react-router-dom';
import { _myfactComDetailView } from './componentes/myfactComView';


export const MyfactComDetailView = () => {
  document.title = 'KUPI | Mis Informes';
  const { numTransaccion } = useParams();

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Mis Informes"/>
          <Row>
            <_myfactComDetailView 
              numTransaccion={numTransaccion} 
            />
          </Row>
        </Container>
      </div>
    </>
  );
}