import { useState, useEffect }      from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { useNavigate }              from 'react-router-dom';
import { logoutUser }               from '../../slices/auth/login/thunk';
// Kupi Icons y Slices
import KUPIICONS                    from '../../common/icons/icons';
import { getAssociatedProfilesWS }           from '../../slices/companies/thunk';
import { setCompanies   }           from '../../slices/thunks';
import { switchEmpresa }            from '../../slices/auth/login/reducer';
import ToastKupi from '@/Components/Common/alertsNotification/toast';


//import images
import avatar2 from '../../assets/images/users/avatar-2.jpg';
import { resetJWTweb } from '../../slices/menus/thunk';



const ProfileDropdown = () => {
  // Router y Redux
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  // Variables del stage
  const user      = useSelector(state => state.Login.user);
  const companies = useSelector( state => state.Companies.companies );

  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [dropdownOpenEmpresa, setDropdownOpenEmpresa] = useState(false);
  const [showToast, setShowToast] = useState({ title  : "",  message: "", type   : "success",  isVisible: false });

  useEffect(() => {
    if (user?.token && user.token.length > 0) getCompanies();
  }, [user]);

  const getCompanies = async () => {
    try {      
      const token = user?.token;
      const { data } = await getAssociatedProfilesWS(token);
      // console.log("La respuesta del WS de get companies es-->", data);
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
  }
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

  // Toggle para el dropdown principal
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(prevState => !prevState);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };


  return (
    <>
      <ToastKupi
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title  : "",  message: "", type   : "success",  isVisible: false })} // Cerrar el toast
      />

      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user py-2 bg-transparent"
      >
        <DropdownToggle
          tag="button"
          type="button"
          className="btn shadow-none border border-white"
        >
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar2}
              alt="Header Avatar"
            />
            <span className='d-xl-inline-block ms-1'>
              < KUPIICONS.ChevronDown/>
            </span>
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          { /* Dropdown de Empresas */ }
          <Dropdown 
            direction="right" 
            toggle={() => setDropdownOpenEmpresa(!dropdownOpenEmpresa)} 
            isOpen={dropdownOpenEmpresa}
          >
            <DropdownToggle tag="span" data-toggle="dropdown" className="dropdown-item">
              <span className='d-xl-inline-block'>
                < KUPIICONS.OfficeBuilder/>
              </span>
              <span className="align-middle ms-2">Empresa</span>
              <span className='d-xl-inline-block ms-1'>
                < KUPIICONS.ChevronDown/>
              </span>

            </DropdownToggle>
            <DropdownMenu>
              {listCompanies()}
            </DropdownMenu>
          </Dropdown>

          <div className="dropdown-divider"></div>
          <DropdownItem href="/profile">
            <i className="mdi mdi-account-circle-outline text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Perfil</span>
          </DropdownItem>
          <DropdownItem href="/pages-profile-settings">
            <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{' '}
            <span className="align-middle">Configuración</span>
          </DropdownItem>
          <DropdownItem href="/profile">
            <i className="mdi mdi-human text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Accesibilidad</span>
          </DropdownItem>
          <DropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{' '}
            <span className="align-middle" data-key="t-logout">
              Cerrar sesión
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ProfileDropdown;
