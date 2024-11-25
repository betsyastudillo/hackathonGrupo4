import { Container, Row } from 'reactstrap';
import { useState, useEffect }         from 'react';
import { useSelector } from 'react-redux';
// Leer los parametros de una ruta
import { useParams } from 'react-router-dom';

// Components
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import _ProfilesView          from './Profiles'
// utilities
import { decryptBase64 } from '@/utilities';

export const ProfilesView = () => {
  
  document.title = 'KUPI | Perfiles x Usuario';

  const { id } = useParams();
  const user      = useSelector(state => state.Login.user);
  const companies = useSelector(state => state.Companies.companies);
  
  const [_id64, setId]                = useState('');


  useEffect(() => {
    setId(decryptBase64(id))
  }, [user, companies]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Perfiles"
          />
          <Row>
            <_ProfilesView id={_id64}/>
          </Row>
        </Container>
      </div>
    </>
  );
};

