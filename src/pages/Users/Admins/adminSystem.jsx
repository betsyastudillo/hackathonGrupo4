
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Modal, Row, Col, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
// Componentes
import KUPIICONS     from '../../../common/icons/icons';
import ToastKupi     from '@/Components/Common/alertsNotification/toast';
import Spinners      from '@/Components/Common/Spinner';
import NoResult      from '@/Components/Common/NoResult';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import SearchableSelectDecoration from '../../../Components/Common/select/searchableSelectDecoration';
import AlertKupi from '../../../Components/Common/alertsNotification/alert';
// WS
import { CompaniesGetUsersWS } from '../../../slices/companies/thunk';
import { assignProfileWS, getprofilesAssignWS, removeProfileWS }    from '../../../slices/profiles/thunk';
// Utilities
import { findAndSetCompanyName } from '../../../utilities';
// Estilos
import '@/pages/Users/Admins/styles/index.scss';
import { createAdminUserWS, getUserByDocumentWS } from '../../../slices/users/thunk';

export const _adminsSystemView = () => {

  const defaultUserAction = { numDocumento: '', nomUsuario: '', apeUsuario: '', telUsuario: '', emaUsuario: '', codPerfil: '', typeDocument: '02' }

  const user      = useSelector(state => state.Login.user);
  const companies = useSelector(state => state.Companies.companies);
  const [companyName, setCompanyName] = useState('');
  // Estados
  const [ isHovered, setIsHovered          ] = useState( false );
  const [ _loading , setLoading            ] = useState( true  );
  const [ _searchingUser, setSearchingUser ] = useState( ""    );
  const [ currentPage, setCurrentPage      ] = useState( 1     );
  const [ admins, setAdmins                ] = useState( []    );
  const [ profiles,   setProfiles          ] = useState([])
  const [ selectedProfile, setSelectedProfile ] = useState(0);
  const [ _crearUsuario , setCrearUsuario ] = useState(0);


  const itemsPerPage = 20;
  // Toast
  const [showToast, setShowToast] = useState({ title: "", message: "", type: "success", isVisible: false });
  const [showAlert, setShowAlert] = useState({ title: "", message: "", isVisible: false });
  
  // Modales
  const [ showModalAdd, setModalAdd       ]  = useState(false);
  const [ showModalEdit, setModalEdit     ]  = useState(false);
  const [ showModalDelete, setModalDelete ]  = useState(false);
  const [ _userAction  , setUserAction    ]  = useState(defaultUserAction);

  useEffect(() => {
    if (user) {
      if (user.codEmpresa) _companiesGetUsers();
      if (user.codPerfil) _getProfiles();
      findAndSetCompanyName(companies, user, setCompanyName);
    }
  }, [user, companies]);
  
  useEffect(() => {
    setSelectedProfile(_userAction?.codPerfil);
  }, [_userAction])
  
  // Estilos 
  const inputStyle = { borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid', backgroundImage: 'none', backgroundColor: 'white' };

  // Web services
  const _companiesGetUsers = async () => {
    try {
      setLoading(true);
      const dataRequest = {
        params: user.codEmpresa,
        token:  user.token,
        bodyOptions: {},
      }
      const {data} = await CompaniesGetUsersWS(dataRequest);
      setAdmins(data);

    } catch (error) {
      setAdmins([]);
      _showToast("Error", "No se pudo obtener los datos.", "danger");
    } finally {
      setLoading(false);
    }
  }

  const _getProfiles = async () => {
    try {
      const { data } = await getprofilesAssignWS(user.codPerfil);
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }

  const _handleAddProfileAction = async (codUsuario) => {
    
    try {
      const dataRequest = {
        params: user.token,
        bodyOptions: {
          codUsuario : +codUsuario,
          codEmpresa : +user.codEmpresa,
          codPerfil  : +selectedProfile,
        }
      }
      await assignProfileWS(dataRequest);
      setUserAction(defaultUserAction);
      _companiesGetUsers();

    } catch (err) {
      const { response } = err;
      const jsonString = JSON.stringify(response.data, null, 2);
      setShowAlert({ title: " Error" + response.status, message: " ", isVisible: true })
      _showToast(`Error ${response?.status || 'desconocido'}`, jsonString, "danger");
      console.error('Error assignProfileWS:', err);
    }
  };

  // Manipuladores
  const _handleConfirmDelete = async () => {
    
    setModalDelete(!showModalDelete);
    _showToast("Procesando...", "Por favor espere", "");

    try {
      const dataRequest = {
        params: user.token,
        bodyOptions: {
          codUsuario : +_userAction.codUsuario,
          codEmpresa : +user.codEmpresa,
        }
      }
      await removeProfileWS(dataRequest);
      setUserAction(defaultUserAction);
      _companiesGetUsers();
    } catch (err) {
      const { response } = err;
      const jsonString = JSON.stringify(response.data, null, 2);
      _showToast(`Error ${response?.status || 'desconocido'}`, jsonString, "danger");
      console.error('Error fetching companies:', err);
    } 
  }

  const _handleConfirmUpdate = async () => {  
    setModalEdit(!showModalEdit);
    _showToast("Procesando...", "Por favor espere", "");
    await _handleAddProfileAction(_userAction.codUsuario);
  }


  const _handleCrearUsuario = async () => {

    console.log(_userAction);
    // Validaciones para cada campo del objeto bodyOptions
    if (!_userAction.nomUsuario || _userAction.nomUsuario.trim() === "") {
      setShowAlert({ title: "Error", message: "El campo 'nombres' es obligatorio.", isVisible: true });
      return;
    }

    if (!_userAction.apeUsuario || _userAction.apeUsuario.trim() === "") {
      setShowAlert({ title: "Error", message: "El campo 'apellidos' es obligatorio.", isVisible: true });
      return;
    }

    if (!_userAction.numDocumento || _userAction.numDocumento.trim() === "") {
      setShowAlert({ title: "Error", message: "El campo 'documento' es obligatorio.", isVisible: true });
      return;
    }

    if (!_userAction.telUsuario || _userAction.telUsuario.trim() === "") {
      setShowAlert({ title: "Error", message: "El campo 'teléfono' es obligatorio.", isVisible: true });
      return;
    }

    if (!_userAction.emaUsuario || _userAction.emaUsuario.trim() === "") {
      setShowAlert({ title: "Error", message: "El campo 'email' es obligatorio.", isVisible: true });
      return;
    }

    try{
      const dataRequest =  {
        token:  user.token,
        bodyOptions: {
          nombres: _userAction.nomUsuario,
          apellidos: _userAction.apeUsuario,
          tipoDocumento: _userAction.typeDocument,
          documento: _userAction.numDocumento,
          telefono: _userAction.telUsuario,
          email: _userAction.emaUsuario,
          codPerfil: +selectedProfile
        }
      }

      const { data } = await createAdminUserWS(dataRequest);
      if (data) {
        setShowAlert({ title: "Operación completada", message: "El usuario se ha creado exitosamente.", isVisible: true });
        _companiesGetUsers();
        toggleCancelAdd();
      }
    } catch (err) {
      if (err.data) {
        setShowAlert({ title: "Error " +err.status , message: JSON.stringify(err.data || "Ocurrió un error inesperado", null, 2), isVisible: true });
      } else {
        console.error(err);
        setShowAlert({ title: "Error ", message: "Ocurrió un error inesperado", isVisible: true });
      }
    } 
  }


  const _handleConfirmAdd = async () => {
    if ( selectedProfile ) {
      setShowAlert({ title: " Procesando", message: " Por favor espere", isVisible: true })
      try {
        const {data} = await getUserByDocumentWS(_userAction.numDocumento);  
        await _handleAddProfileAction(data.codUsuario);
      } catch (err) {
        const { response } = err;
        if( response.status === 404 && _crearUsuario === 0 ) {
          setShowAlert({ title: " Error " + response.status, message: " Usuario no encontrado en el sistema Kupi, por favor cree el usuario ", isVisible: true })
          setCrearUsuario(1);
        } else if ( response.status != 404 ) {
          setShowAlert({ title: " Error " + response.status, message: JSON.stringify(response.data, null, 2) , isVisible: true })
        } else if ( _crearUsuario === 1 ) {
          await _handleCrearUsuario();
        }
      } 
    } else {
      setShowAlert({ title: " Error", message: "Debe seleccionar un perfil antes de continuar.", isVisible: true })
    } 
  }

  const _handlePageChange = (page) => (page > 0 && page <= totalPages) ? setCurrentPage(page) : null;

  const _handlerUser = (e, user, action) => {
    e.preventDefault();
    setUserAction(user);
    if      ( action === 1  ) setModalEdit(!showModalEdit);
    else if ( action === 2  ) setModalDelete(!showModalDelete);
  }

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setUserAction((prevState) => ({
      ...prevState,
      [field]: value,
      codPerfil: selectedProfile
    }));
  }; 

  // Otros
  const profilesOptions = profiles.map((profile) => ({
    value: profile.codPerfil,
    label: profile.nomPerfil,
  }));

  const _showToast = (title, message, type = 'success') => {
    setShowToast({ title, message, type, isVisible: true });
  };

  // Filtrar usuarios según búsqueda
  const searchLower = _searchingUser.toLowerCase();
  const filteredUsers = admins.filter(({ nomUsuario, apeUsuario, nomPerfil, numDocumento }) => {
    const fullName = `${nomUsuario} ${apeUsuario}`.toLowerCase();
    return fullName.includes(searchLower) || nomPerfil.toLowerCase().includes(searchLower) || numDocumento.toLowerCase().includes(searchLower);
  });


  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onChangeData = (value) => {
    setSearchingUser(value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Cerrar el modal Edit
  const toggleCancelEdit = () => {
    setUserAction(defaultUserAction);
    setModalEdit(!showModalEdit);
  }
  // Cerrar el modal Add
  const toggleCancelAdd = () => {
    setUserAction(defaultUserAction);
    setModalAdd(!showModalAdd);
  }

  const toggleDelete = () => {
    setModalDelete(!showModalDelete);
    setUserAction(defaultUserAction);
  }

  // Componentes
  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          {/* <th scope="col"> Tipo de Documento   </th> */}
          <th scope="col"> Documento </th>
          <th scope="col">Nombre</th>
          {/* <th>Apellidos</th> */}
          <th scope="col">Perfil</th>
          <th className='d-flex justify-content-center' >Acciones</th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((user, index) => (
          <tr key={index}>
            {/* <td>{user?.codUsuario}</td> */}
            <td>{user?.numDocumento}</td>
            <td>{user?.nomUsuario +" "  + user?.apeUsuario}</td>
            {/* <td>{user?.apeUsuario}</td> */}
            <td>{user?.nomPerfil}</td>
            <td>
              <div className="gap-2 d-flex justify-content-center" >
                <div className="ms-2" onClick={(e) => _handlerUser(e, user, 1)}>
                  <KUPIICONS.Edit/>
                </div>
                <div className="ms-2" onClick={(e) => _handlerUser(e, user, 2)}>
                  <KUPIICONS.Trash2 stroke='#690BC8' strokeWidth="2"/>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  // Modal de Agregar
  function _modalAdd() {
    return(
      <Modal fade={true} isOpen={showModalAdd} toggle={toggleCancelAdd} centered>
        <ModalHeader toggle={toggleCancelAdd}> Agregar Administrador </ModalHeader>
        <ModalBody>
          <h5 className='h5-title'> Datos Generales </h5>
          <Row>
            <Col sm={12}>
              <Label className='font-title-form'>Número Documento </Label>
              <Input
                style= {inputStyle}
                placeholder='Ingresa el número Documento'
                type="number"
                value={_userAction.numDocumento}
                onChange={(e) => handleInputChange(e, 'numDocumento')}
              />
            </Col>

            { _crearUsuario === 1 && 
              <Row>
                <Col sm = {12}>
                  <Label htmlFor="typeDocument" className="form-label mt-3"> Tipo de documento </Label>

                  <select
                    name="typeDocument"
                    value={_userAction.typeDocument || '02'} // Asegúrate de que el valor inicial esté definido
                    style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid', backgroundImage: 'none' }}
                    className={`form-select mb-3 text-muted`}
                    onChange={(e) => handleInputChange(e, 'typeDocument')}
                  >
                    <option value="01">NIT</option>
                    <option value="02">Cédula de ciudadanía</option>
                    <option value="03">Pasaporte</option>
                    <option value="04">Tarjeta de Identidad</option>
                    <option value="05">Cédula de extranjería</option>
                  </select>
                </Col>
                <Col sm={6}>
                  <Label className='font-title-form'> Nombre(s) </Label>
                  <Input
                    style= {inputStyle}
                    type="text"
                    placeholder='Ingresa el nombre'
                    value={_userAction.nomUsuario}
                    onChange={(e) => handleInputChange(e, 'nomUsuario')}
                  />
                </Col>
                <Col sm={6}>
                  <Label className='font-title-form'> Apellido(s) </Label>
                  <Input
                    style= {inputStyle}
                    type="text"
                    placeholder='Ingresa el apellido'
                    value={_userAction.apeUsuario}
                    onChange={(e) => handleInputChange(e, 'apeUsuario')}
                  />
                </Col>
                <Col sm={6}>
                  <Label className='font-title-form'> Teléfono </Label>
                  <Input
                    style= {inputStyle}
                    type="number"
                    placeholder='Ingresa el número de teléfono'
                    value={_userAction.telUsuario}
                    onChange={(e) => handleInputChange(e, 'telUsuario')}
                  />
                </Col>
                <Col sm={6}>
                  <Label className='font-title-form'> Email </Label>
                  <Input
                    style= {inputStyle}
                    type="text"
                    placeholder='email@email.com'
                    value={_userAction.emaUsuario}
                    onChange={(e) => handleInputChange(e, 'emaUsuario')}
                  />
                </Col>
              </Row>
            }
          </Row>


          <h5 className='h5-title secondParragraph'> {companyName} </h5>
          <Row>
            <Col sm={12}>
              <SearchableSelectDecoration
                title="Perfil"
                options={profilesOptions}
                placeholder="Seleccionar perfil..."
                onChange={(value) => setSelectedProfile(value)}
                selectedValue={selectedProfile}
              />
            </Col>
          </Row>
          <div className='mt-2 mb-2'>
            <AlertKupi 
              title     = { showAlert.title}
              message   = { showAlert.message}
              isVisible = { showAlert.isVisible}
              onClose   = { () => setShowAlert({ title: "", message: "", type: "success", isVisible: false })}     
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <div className='d-flex justify-content-between w-100'>
            <div className='px-1 w-50'>
              <Button  color="outline-primary"  className='w-100' onClick={toggleCancelAdd} >
                Cancelar
              </Button>
            </div>
            <div className='px-1 w-50'>
              <Button  color="primary" className='w-100' onClick={_handleConfirmAdd} >
                Agergar
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
  // Modal de Edit
  function _modalEdit() {
    return(
      <Modal fade={true} isOpen={showModalEdit} toggle={toggleCancelEdit} centered>
        <ModalHeader toggle={toggleCancelEdit}> Editar Administrador </ModalHeader>
        <ModalBody>
          <h5 className='h5-title'> Datos Genetales </h5>
          <Row>
            <Col sm={12}>
              <Label className='font-title-form'>Número Documento </Label>
              <Input
                style= {inputStyle}
                disabled = {true}
                type="text"
                value={_userAction.numDocumento}
              />
            </Col>
            <Col sm={12}>
              <Label className='font-title-form'> Teléfono </Label>
              <Input
                style= {inputStyle}
                disabled = {true}
                type="text"
                value={_userAction.telUsuario}
              />
            </Col>
          </Row>


          <h5 className='h5-title secondParragraph'> {companyName} </h5>
          <Row>
            <Col sm={12}>
              <SearchableSelectDecoration
                title="Perfil"
                options={profilesOptions}
                placeholder="Seleccionar perfil..."
                onChange={(value) => setSelectedProfile(value)}
                selectedValue={selectedProfile}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div className='d-flex justify-content-between w-100'>
            <div className='px-1 w-50'>
              <Button  color="outline-primary"  className='w-100' onClick={toggleCancelEdit} >
                Cancelar
              </Button>
            </div>
            <div className='px-1 w-50'>
              <Button  color="primary" className='w-100' onClick={_handleConfirmUpdate} >
                Guardar
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
  // Modal de Eliminar
  function _modalDelete() {
    return(
      <Modal isOpen={showModalDelete} toggle={toggleDelete} centered>
        <ModalHeader toggle={toggleDelete}> ¿Desea eliminar este usuario? </ModalHeader>
        <ModalBody>
          <NoResult tittle={_userAction?.nomUsuario +" "+ _userAction?.apeUsuario } message={ _userAction?.nomPerfil }/>
        </ModalBody>
        <ModalFooter>
          <Button  color="" onClick={toggleDelete} style={{  backgroundColor: '#DDF580', }}>
            Cancelar
          </Button>
          <Button color="primary" onClick={_handleConfirmDelete}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  return (
    <Container className="p-3" fluid>
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title: "", message: "", type: "success", isVisible: false })}
      />
      { _modalAdd()    }
      { _modalEdit()   }
      { _modalDelete() }
      <div className='d-flex mb-lg-2'>
        <h5 className='mx-2 text-primary'> Administradores </h5>
      </div>
      <div className='d-flex justify-content-between mb-lg-2'>
        <h3>
          <strong className='text-primary' style={{fontSize: "25px"}}> l </strong> Administradores
        </h3>
        <Button className='m-2' color='outline-primary' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={toggleCancelAdd}>
          <KUPIICONS.Plus 
            height='16' 
            width='16'   
            stroke={isHovered ? 'white' : '#690BC8'}
            strokeWidth='2'
          />
          <span className='ms-1'> Añadir Administrador </span>
        </Button>

      </div>
      
      <Row>
        <Col xl={12}>
          <Card className="bodyTable">
            <CardBody>
              <Row className="g-0 d-flex justify-content-end">
                <Col lg={4} xl={3}>
                  <div className="position-relative">
                    <Input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Buscar..."
                      id="search-options"
                      value={_searchingUser}
                      onChange={(e) => onChangeData(e.target.value)}
                    />
                    <span className="search-icon position-absolute">
                      <KUPIICONS.Search height="20" width="20" />
                    </span>
                    <span
                      className="mdi mdi-close-circle search-widget-icon search-widget-icon-close position-absolute"
                      id="search-close-options"
                      onClick={() => onChangeData('')}
                    />
                  </div>
                </Col>
              </Row>
              { _loading && <Spinners/> }

              <div style={{ overflowX: 'auto' }}> 
                <table className="table align-middle table-nowrap mt-4" id="userTable">
                  {_tableTittles()}
                  { !_loading && (_tableBody()) }
                  
                </table>
              </div>

              { filteredUsers.length === 0 && !_loading &&  ( <NoResult/> ) }
              
              { filteredUsers.length > 0 && 
                  <PaginationBar
                  totalItems={filteredUsers.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={_handlePageChange}
                  />
                }
            </CardBody>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default _adminsSystemView;
