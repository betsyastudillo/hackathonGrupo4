import { Link } from 'react-router-dom';
import { Col, Row, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, } from 'reactstrap';
import { useState, useEffect }      from 'react';
import { useSelector, useDispatch } from 'react-redux';

import KUPIICONS                    from '@/common/icons/icons';

import { getAssociatedProfilesWS, setCompanies  }  from '../../slices/thunks';
import { switchEmpresa }  from '../../slices/auth/login/reducer';
import { resetJWTweb   }  from '../../slices/menus/thunk';


import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../utilities';
import { findAndSetCompanyName } from '@/utilities';

const BreadCrumb = ({ icon, title="", pageTitle }) => {

  // Router y Redux
  const dispatch  = useDispatch();
  // Variables del stage
  const user      = useSelector(state => state.Login.user);
  const companies = useSelector( state => state.Companies.companies );
  const [showToast, setShowToast] = useState(toastDefault);
  const [dropdownOpenEmpresa, setDropdownOpenEmpresa] = useState(false);
  
  const [companyName, setCompanyName] = useState('');


  useEffect(() => {
    findAndSetCompanyName(companies, user, setCompanyName);
  }, [user, companies]);

  useEffect(() => {
    if (user?.token && user.token.length > 0) getCompanies();
  }, [user]);

  const getCompanies = async () => {
    try {      
      const token = user?.token;
      const { data } = await getAssociatedProfilesWS(token);
      dispatch(setCompanies(data));
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const switchCompany = async (company) => {
    try {      
       const token = user?.token;
       const { data } = await resetJWTweb(company.codPerfil, company.codEmpresa, token);
       
       setShowToast({ title  : "Cambio exitoso",  message: " ", type   : "success",  isVisible: true });
 
       dispatch(switchEmpresa({
         codEmpresa  : company.codEmpresa,
         codPerfil   : company.codPerfil,
         nomEmpresa  : company.nomEmpresa,
         token       : data.token
       }));
     } catch (err) {
       console.error('Error fetching companies:', err);
     }
  };

  // Función para mapear y mostrar las empresas
  const listCompanies = () => {
    // console.log("El companies es--->", companies);
    return companies.length > 0
      ? companies.map((company, index) => (
        <DropdownItem key={index} onClick={() => switchCompany(company)}>
            {company.nomEmpresa}
          </DropdownItem>
        ))
      : <DropdownItem>Sin Empresa</DropdownItem>;
  };

  return (
    <>
      <ToastKupi
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title  : "",  message: "", type   : "success",  isVisible: false })} // Cerrar el toast
      />

      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <div className="mb-sm-0">
              <Dropdown 
                direction="right" 
                toggle={() => setDropdownOpenEmpresa(!dropdownOpenEmpresa)} 
                isOpen={dropdownOpenEmpresa}
              >
                <DropdownToggle tag="span" data-toggle="dropdown" className="dropdown-item">
                  <span className="align-middle ms-2" style={{fontWeight: 'bold'}}>{companyName} </span>
                  <span className='d-xl-inline-block ms-1'>
                    < KUPIICONS.ChevronDown/>
                  </span>
                </DropdownToggle>
                <DropdownMenu>
                  {listCompanies()}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">{pageTitle}</Link>
                </li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BreadCrumb;
