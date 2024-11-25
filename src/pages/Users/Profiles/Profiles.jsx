import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button  } from 'reactstrap';
import { useSelector } from 'react-redux';

// Componentes
import Spinners from '@/Components/Common/Spinner';
import KUPIICONS from '../../../common/icons/icons';
import NoResult  from '@/Components/Common/NoResult';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import SearchableSelect from '../../../Components/Common/select/searchableSelect';
import ToastKupi from '../../../Components/Common/alertsNotification/toast';

// Slices
import { getCompaniesWS  }  from '@/slices/companies/thunk';
import { findUserByIdtWS }  from '@/slices/users/thunk';
import { getprofilesAssignWS, getprofilesAssignedbyUserWS, removeProfileWS, assignProfileWS }  from '@/slices/profiles/thunk';
// Utilities
import { defaultUser, formatDate } from '@/utilities';
// Estilos
import '@/pages/Users/Profiles/styles/index.scss'
export const _UserProfileView = ({ id }) => {

  const user       = useSelector(state => state.Login.user);
  const navigation = useNavigate();
  // States
  const [ _loading    , setLoading   ] = useState(true);
  const [ _fetchedUser, setFetchUser ] = useState(defaultUser);
  const [_fetchProfilesUser, setFetchProfilesUSer ] = useState([]);
  const [_searchingProfileUser, setSearchingProfileUser] = useState("");
  
  const [showModal, setModal] = useState(false);
  const [_ProfileDelete, setProfileDelete] = useState({});
  
  const [companies,   setCompanies]           = useState([])
  const [selectedCompany, setSelectedCompany] = useState(0);

    
  const [profiles,   setProfiles]           = useState([])
  const [selectedProfile, setSelectedProfile] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;
 
  // Manejador del Alert
  const [showToast, setShowToast] = useState({
    title  : "",  message: "",
    type   : "success",  isVisible: false
  });

  useEffect(() => {
    if (user?.codPerfil && user.codPerfil > 0 && id ) _getInformation();
  }, [user, id]);
  
  const _getInformation = async () => {
    try {
      await Promise.all([findUserByID(), getProfiles(), getCompanies(), getProfilesAsignbyUser()]);
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
    } catch (err) {
      console.error('Error fetching user by ID:', err);
    }
  }

  const getProfiles = async () => {
    try {
      const { data } = await getprofilesAssignWS(user.codPerfil);
      console.log("Perfiles a asignar--->", data);
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }

  const getCompanies = async () => {
    try {
      const { data } = await getCompaniesWS(user.token);
      // console.log("Las compañias son", data);
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  }

  const getProfilesAsignbyUser = async () => {
    try {
      const { data } = await getprofilesAssignedbyUserWS(user.token, id);
      setFetchProfilesUSer(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }


  // manipuladores y manejadores
  const filteredProfilesUser = _fetchProfilesUser.filter((profile) =>
    profile?.nomEmpresa.toLowerCase().includes(_searchingProfileUser.toLowerCase()) 
  );

  // Opciones de las empresas para el select
  const companyOptions = companies.map((company) => ({
    value: company.codEmpresa,
    label: company.nomEmpresa,
  }));

  const profilesOptions = profiles.map((profile) => ({
    value: profile.codPerfil,
    label: profile.nomPerfil,
  }));

  const totalPages           = Math.ceil(filteredProfilesUser.length / itemsPerPage);
  const currentItems         = filteredProfilesUser.slice( (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage );
  
  const toggle = () => {
    setModal(!showModal);
    setProfileDelete({});
  }

  const onChangeData = (value) => {
    setSearchingProfileUser(value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const _handlerDeleteUser = (e, ProfilesUser) => {
    e.preventDefault();
    setProfileDelete(ProfilesUser);
    setModal(!showModal);
  } 

  const AddProfileAction = async () => {
    if (selectedCompany === 0 && selectedProfile === 0) {
      setShowToast({
        title: "Error",
        message: "Debe seleccionar una empresa y un perfil antes de continuar.",
        type: "danger",
        isVisible: true
      });
    } else if (selectedCompany === 0) {
      setShowToast({
        title: "Error",
        message: "Debe seleccionar una empresa antes de continuar.",
        type: "danger",
        isVisible: true
      });
    } else if (selectedProfile === 0) {
      setShowToast({
        title: "Error",
        message: "Debe seleccionar un perfil antes de continuar.",
        type: "danger",
        isVisible: true
      });
    } else {
      try {
        const dataRequest = {
          params: user.token,
          bodyOptions: {
            codUsuario : +id,
            codEmpresa : +selectedCompany,
            codPerfil  : +selectedProfile,

          }
        }
        await assignProfileWS(dataRequest);
        setProfileDelete({});
        setSelectedCompany("");
        setSelectedProfile("");

        navigation(0);
      } catch (err) {
        const { response } = err;
        console.log(response);
        const jsonString = JSON.stringify(response.data, null, 2);
    
        setShowToast({
          title  :  `Error ${response?.status || 'desconocido'}`, 
          message: jsonString,
          type   : "danger",  isVisible: true
        });
    
        console.error('Error fetching companies:', err);
      } 
    }
  };

  const DeleteProfileAction = async () => {
    // console.log(_ProfileDelete);

    setModal(!showModal);

    setShowToast({
      title  : "Procesando...",  message: "Por favor espere",
      type   : "",  isVisible: true
    });

    try {
      const dataRequest = {
        params: user.token,
        bodyOptions: {
          codUsuario : +id,
          codEmpresa : _ProfileDelete.codEmpresa,
        }
      }

      await removeProfileWS(dataRequest);
      setProfileDelete({});
      navigation(0);
    } catch (err) {
      const { response } = err;
      console.log(response);
      const jsonString = JSON.stringify(response.data, null, 2);

      setShowToast({
        title  :  `Error ${response?.status || 'desconocido'}`, 
        message: jsonString,
        type   : "danger",  isVisible: true
      });

      console.error('Error fetching companies:', err);
    } 
  }

  function _modalDelete() {
    return(
      <Modal isOpen={showModal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}> ¿ Deseas Eliminar este perfil ? </ModalHeader>
        <ModalBody>
          <NoResult tittle={_ProfileDelete?.nomEmpresa} message={_ProfileDelete?.nomPerfil}/>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            Cancelar
          </Button>
          <Button color="primary" onClick={DeleteProfileAction}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th className='tableMaxWidth'> Empresa</th>
          <th > Perfil</th>
          <th className='tableMaxWidth'> Creado Por</th>
          <th > Fecha</th>
          <th className='d-flex justify-content-center tableFieldsm' > Eliminar </th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((profilesUser, index) => (
          <tr key={index}>
            <td className='tableMaxWidth'>{profilesUser?.nomEmpresa}</td>
            <td >{profilesUser?.nomPerfil}</td>
            <td className='tableMaxWidth'> {profilesUser?.nomUsuario + " "+ profilesUser?.apeUsuario}</td>
            <td >{ formatDate(profilesUser?.fecEdicion)}</td>
            <td >
              <div 
                className="gap-2 d-flex justify-content-center"           
                onClick={(e) => _handlerDeleteUser(e, profilesUser)}
              >
                <KUPIICONS.Trash2/>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  function _Principal() {
    return (
      <Container fluid>
        
        {_modalDelete()}
        <Card className='bodyCardAsociatedProfiles'>
          
          <Row className="g-0 d-flex justify-content-end">
            <Col lg={4} xl={4}>
              <div className="position-relative">
                <Input
                  type="text"
                  className="form-control ps-5 m-2"
                  placeholder="Buscar..."
                  id="search-options"
                  value={_searchingProfileUser}
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
          <div className="table-responsive table-card mt-2 mb-1 px-2">
            <table className="table align-middle table-nowrap tableComplete" id="userTable">
              {_tableTittles()}
              {_tableBody() }
            </table>
            { 
              filteredProfilesUser.length > 0 && (
                <Container className='px-4'>
                  <PaginationBar
                  totalItems    = {filteredProfilesUser.length}
                  itemsPerPage  = {itemsPerPage}
                  currentPage   = {currentPage}
                  onPageChange  = {handlePageChange}
                  />
                </Container>
              )
            }
          </div>

        </Card>
        <Card className='bodyCardAssignProfiles'>
          <Row>
            <Col xl={6}>
              <SearchableSelect
                title="Empresas"
                options={companyOptions}
                placeholder="Seleccionar empresa..."
                onChange={(value) => setSelectedCompany(value)}
                selectedValue={selectedCompany}
              />
            </Col>
            <Col xl={6}>
              <SearchableSelect
                title="Perfil"
                options={profilesOptions}
                placeholder="Seleccionar perfil..."
                onChange={(value) => setSelectedProfile(value)}
                selectedValue={selectedProfile}
              />
            </Col>
          </Row>
          <Container className='d-flex align-content-end justify-content-end mt-3 mb-3'>
            {/* <Button className="mx-2" style={{width:"100px"}} color="danger" onClick={toggle}>
              Cancelar
            </Button> */}
            <Button className="mx-2" style={{width:"100px"}} color="primary" onClick={AddProfileAction}>
              Aceptar
            </Button>
          </Container>
        </Card>
      </ Container>
    )
  }

  function _MenudeOpciones() {
    return (
      <>
        <Card>
          <CardBody>
            <div className='d-flex align-content-center'>
              <KUPIICONS.Users height='16' width='16'/>
              <h5 className='mx-4'> { _fetchedUser.nomUsuario +" "+ _fetchedUser.apeUsuario}</h5>
            </div>
          </CardBody>
        </Card>
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
      </>
    );
  }

  function _DatosGenerales() {
    return (
      <Row>
        <Col xl={3}>
          {_MenudeOpciones()}
        </Col>
        <Col xl={9}>
         { _Principal() }
        </Col>
      </Row>
    );
  }

  return(
    <>
    
      <ToastKupi
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({
          title  : "",  message: "",
          type   : "success",  isVisible: false
        })} // Cerrar el toast
      />
      <Row>
        <Col xl={12}>
          <div>
            <CardHeader>
              <div className='d-flex mb-lg-4'>
                <KUPIICONS.Pencil height='16' width='16'/>
                <h6 className='f-bold mx-2'> Asignar / Perfiles </h6>
              </div>
            </CardHeader>
            <CardBody style={{ minHeight: "100vh" }}>
              { 
                _loading
                ? <Spinners />
                :_DatosGenerales() 
              }
            </CardBody>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default _UserProfileView;