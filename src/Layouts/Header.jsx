// Use Efect
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createSelector } from 'reselect';

// Componentes
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';
import ProfileDropdown    from '../Components/Common/ProfileDropdown';
import SearchOption       from '../Components/Common/SearchOption'  ;

import LightDark          from '../Components/Common/LightDark';

// Reducer - Thunks
import { changeSidebarVisibility } from '../slices/thunks';
import { loginSuccess }            from '@/slices/auth/login/reducer';
// Iconos
import { KLogoIcon }               from '@/common/icons/icons';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  
  const dispatch = useDispatch();
  const user      = useSelector(state => state.Login.user);
  const companies = useSelector(state => state.Companies.companies);
    
  const [localUser, setLocalUser] = useState(null);
  const [_perfil, setPerfil]      =  useState("Administrador")

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      const _User = localStorage.getItem('user');
      if (_User) {
        const parsedUser = JSON.parse(_User);
        setLocalUser(parsedUser);
        dispatch(loginSuccess(parsedUser));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    const _aux = companies.find( company  => company.codEmpresa == user.codEmpresa );
    setPerfil(_aux?.nomPerfil)
  }, [companies])
  

  const selectDashboardData = createSelector(
    state => state.Layout,
    sidebarVisibilitytype => sidebarVisibilitytype.sidebarVisibilitytype
  );
  const sidebarVisibilitytype = useSelector(selectDashboardData);

  const [search, setSearch] = useState(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility('show'));

    if (windowSize > 767)
      document.querySelector('.hamburger-icon').classList.toggle('open');

    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      document.body.classList.contains('menu')
        ? document.body.classList.remove('menu')
        : document.body.classList.add('menu');
    }

    if (
      sidebarVisibilitytype === 'show' &&
      (document.documentElement.getAttribute('data-layout') === 'vertical' ||
        document.documentElement.getAttribute('data-layout') === 'semibox')
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? document.documentElement.setAttribute('data-sidebar-size', '')
          : document.documentElement.setAttribute('data-sidebar-size', 'sm');
      } else if (windowSize > 1025) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'lg'
          ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
          : document.documentElement.setAttribute('data-sidebar-size', 'lg');
      } else if (windowSize <= 767) {
        document.body.classList.add('vertical-sidebar-enable');
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      document.body.classList.contains('twocolumn-panel')
        ? document.body.classList.remove('twocolumn-panel')
        : document.body.classList.add('twocolumn-panel');
    }
  };

  return (
    <>
      <header id="page-topbar" className={headerClass}>
        <div
          className="layout-width"
          style={{ background: 'linear-gradient(to right, white 40%, #E6E6FA 60%)', }}
        >
          <div className="navbar-header">
            <div className="d-flex" style={{ flexDirection: 'row' }}>
              <div>
                <KLogoIcon />
              </div>

              <div className="ms-3">
                <p
                  className="mb-0"
                  style={{ fontSize: '18px', fontWeight: 500 }}
                >
                  Hola,{' '}
                  <span className="text-primary">
                    {(user || localUser)?.nomUsuario}
                  </span>
                </p>
                <p className="mb-0"> { _perfil } </p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <SearchOption />

              {/* Btn Hamburguesa */}
              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              <FullScreenDropdown />
              {/* <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              /> */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
