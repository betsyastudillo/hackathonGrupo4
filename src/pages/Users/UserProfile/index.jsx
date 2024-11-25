import { Container, Row } from 'reactstrap';
import { useState, useEffect }         from 'react';
import { useSelector } from 'react-redux';
// Leer los parametros de una ruta
import { useParams } from 'react-router-dom';

// Components
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import _UserProfileView          from './UserProfile'
// utilities
import { findAndSetCompanyName } from '@/utilities';

export const UserProfileView = () => {
  
  document.title = 'KUPI | Usuario';

  const { id } = useParams();
  const user      = useSelector(state => state.Login.user);
  const companies = useSelector(state => state.Companies.companies);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    findAndSetCompanyName(companies, user, setCompanyName);
  }, [user, companies]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title={companyName}
            pageTitle="Usuario"
          />
          <Row>
            <_UserProfileView id={id}/>
          </Row>
        </Container>
      </div>
    </>
  );
};