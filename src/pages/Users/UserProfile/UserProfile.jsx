import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Nav, NavItem, NavLink, Pagination, PaginationItem, PaginationLink, Progress, Row, TabContent, Table, TabPane, UncontrolledCollapse, UncontrolledDropdown } from 'reactstrap';
import classnames from 'classnames';
// Estilos
import '@/pages/Users/UserProfile/styles/index.scss';
// Assets
import profileBg from '@/assets/images/bg-profile.jpg';
import avatar1   from '@/assets/images/users/user.jpg';
// Utilities
import { encryptBase64 } from '@/utilities';

import { _FormProfileUser } from '../UserProfileSimple/FormProfileUser';
import { defaultUser } from '@/utilities';
import { findUserByIdtWS }  from '@/slices/users/thunk';

export const _UserProfileView = ({ id }) => {
  
  const navigate  = useNavigate();
  const user = useSelector(state => state.Login.user);

  const [ _fetchedUser, setFetchUser ] = useState(defaultUser);
  const [ _loading , setLoading ] = useState(true);
  
  const [activeTab, setActiveTab] = useState('1');
  const [activityTab, setActivityTab] = useState('1');

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    _getInformation();
  }, [user]);

  const _getInformation = async () => {
    try {
      await Promise.all([findUserByID()]);
    } catch (error) {
      console.error('Error fetching information:', error);
    } finally{
      setLoading(!_loading);
    }
  }

  const findUserByID = async () => {
    try {
      const { data } = await findUserByIdtWS(user.token, id);
      setFetchUser(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }

  const _ModificarPerfiles = () => {
    const id64 = encryptBase64(id);
    console.log("Entro aqui", id64);
    navigate('/perfilesUsuario/'+id64);
  }



  function _bgProfile() {
    return (
      <div className="profile-foreground position-relative mx-n4 mt-n4">
      <div className="profile-wid-bg">
          <img src={profileBg} alt="" className="profile-wid-img" />
      </div>
    </div>
    );
  }

  function _cardHeaderUserData () {
    return (
      <Col>
        <div className="p-2">
          <h3 className="text-white mb-1"> {_fetchedUser.nomUsuario} {_fetchedUser.apeUsuario}</h3>
          <p className="text-white text-opacity-75 mb-1"> Kupi Financiador </p>
          <div className="hstack text-white-50">
            <div>
              Cali , Valle del Cauca
            </div>
          </div>
        </div>
      </Col>
    );
  }

  function _cardHeaderUserBalances () {
    return (
      <Col xs={12} className="col-lg-auto order-last order-lg-0">
        <Row className="text text-white-50 text-center">
          <Col lg={4} xs={4}>
            <div className="p-2">
              <h4 className="text-white mb-1">24.3K</h4>
              <p className="fs-14 mb-0">Bono</p>
            </div>
          </Col>
          <Col lg={4} xs={4}>
            <div className="p-2">
              <h4 className="text-white mb-1">1.3K</h4>
              <p className="fs-14 mb-0">Subsidios</p>
            </div>
          </Col>
          <Col lg={4} xs={4}>
            <div className="p-2">
              <h4 className="text-white mb-1">1.3K</h4>
              <p className="fs-14 mb-0">Cupos</p>
            </div>
          </Col>
        </Row>
      </Col>
    );
  }

  function _UserOptions () {
    return (
      <div className="d-flex">
        <Nav pills className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
          role="tablist">
          <NavItem>
            <NavLink
              href="#overview-tab"
              className={classnames({ active: activeTab === '1' }, "fs-14")}
              onClick={() => { toggleTab('1'); }}
            >
              <i className="ri-airplay-fill d-inline-block d-md-none"></i> <span
              className="d-none d-md-inline-block"> Datos Generales </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#activities"
              className={classnames({ active: activeTab === '2' }, "fs-14")}
              onClick={() => { toggleTab('2'); }}
            >
              <i className="ri-list-unordered d-inline-block d-md-none"></i> <span
              className="d-none d-md-inline-block"> CRM </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#projects"
              className={classnames({ active: activeTab === '3' }, "fs-14")}
              onClick={() => { toggleTab('3'); }}
            >
              <i className="ri-price-tag-line d-inline-block d-md-none"></i> <span
              className="d-none d-md-inline-block">Log Cupo </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#documents"
              className={classnames({ active: activeTab === '4' }, "fs-14")}
              onClick={() => { toggleTab('4'); }}
            >
              <i className="ri-folder-4-line d-inline-block d-md-none"></i> <span
              className="d-none d-md-inline-block"> Log Cambio de Datos</span>
            </NavLink>
          </NavItem>
        </Nav>
        <div className="flex-shrink-0">
          <Row className="justify-content-end">
            <Link to="/pages-profile-settings" className="btn btn-success mb-2 maxWidth_btn">
              Enviar SMS
            </Link>
            <Link to="/pages-profile-settings" className="btn btn-danger maxWidth_btn">
              Agregar Evento
            </Link>
          </Row>
        </div>
      </div>
    );
  }

  function _tabDatosGenerales() {
    return (
      <Row>
        <Col xxl={3}>
          <Card>
            <CardBody>
              <h6 className="f-bold mb-3"> Acciones Usuario </h6>
              <button 
                className="btn btn-outline-primary w-100 btn-sm mb-1"
                onClick={() => { _ModificarPerfiles(); }}
              > 
                Modificar perfiles 
              </button>
              <button className="btn btn-outline-primary w-100 btn-sm mb-1"> Editar              </button>
              <button className="btn btn-outline-primary w-100 btn-sm mb-1"> Transacciones       </button>
              <button className="btn btn-outline-primary w-100 btn-sm mb-1"> Bonos bloqueados    </button>
              <button className="btn btn-outline-primary w-100 btn-sm mb-1"> Compromisos de Pago </button>

            </CardBody>
          </Card>
          <Card>
            <CardBody>
                <h5 className="card-title mb-5"> Perfiles Asociados </h5>
                <Progress value={30} color="danger" className="animated-progess custom-progress progress-label" ><div className="label">30%</div> </Progress>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
                <h5 className="card-title mb-5">Complete Your Profile</h5>
                <Progress value={30} color="danger" className="animated-progess custom-progress progress-label" ><div className="label">30%</div> </Progress>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
                <h5 className="card-title mb-5">Complete Your Profile</h5>
                <Progress value={30} color="danger" className="animated-progess custom-progress progress-label" ><div className="label">30%</div> </Progress>
            </CardBody>
          </Card>
        </Col>
        <Col xxl={9} className='mt-5'>
          <_FormProfileUser id={id} readOnly />
        </Col>
      </Row>
    );
  }

  function _tabContent () {
    return (
      <TabContent activeTab={activeTab} className="pt-4">
        <TabPane tabId="1">
          {_tabDatosGenerales()}
        </TabPane>
        <TabPane tabId="2">
        </TabPane>
        <TabPane tabId="3">
        </TabPane>
        <TabPane tabId="4">
        </TabPane>
      </TabContent>
    );
  }

  return (
    <>
      <Container fluid>
        {_bgProfile()}
        <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
          <Row className="g-4">
            <div className="col-auto">
              <div className="avatar-lg">
                <img src={avatar1} alt="user-img" className="img-thumbnail rounded-circle" />
              </div>
            </div>
            { _cardHeaderUserData()   }
            {_cardHeaderUserBalances()}
          </Row>
          <Row>
            <Col lg={12}>
              <div className='mt-2'>
                {_UserOptions()}
                { _tabContent()}
              </div>
            </Col>
          </Row>
        </div>
        {id}
      </Container>
    </>
  );
}

export default _UserProfileView;
