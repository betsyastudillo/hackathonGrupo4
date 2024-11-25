import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  getProfilesWS,
  updateProfileWS,
  createProfileWS,
} from '../../slices/profiles/thunk';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  CardHeader,
  Input,
  ModalFooter,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
} from 'reactstrap';

// Iconos
import KUPIICONS from '@/common/icons/icons';
//Estilo
import '@/pages/Menus/styles/index.scss';

export const ListProfiles = () => {
  // Hook para redirigir a submenús
  const navigate = useNavigate();

  const handleMenusRedirect = codPerfil => {

    navigate(`/menus-associated-profiles/${codPerfil}`);
  };

  // Obtenemos de los parámetros el codMenuPrincipal
  // const { codMenuPrincipal } = useParams();

  const _defaultCurrentProfile = {
    codPerfil: '',
    nomPerfil: '',
    obsPerfil: '',
  };

  // Use States
  const [_profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(_defaultCurrentProfile);
  const [_searchingProfiles, setSearchingProfiles] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Use effects
  useEffect(() => {
    getProfiles();
  }, []);

  // Web Services or Calling to Api
  const getProfiles = async () => {
    try {
      const { data } = await getProfilesWS();

      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  };

  // Guardar nuevo perfil o actualizar existente
  const saveProfile = async () => {
    try {
      if (isEditMode) {
        // Editar menú existente
        const data = {
          params: currentProfile.codPerfil,
          bodyOptions: {
            nomPerfil: currentProfile.nomPerfil,
            obsPerfil: currentProfile.obsPerfil || '',
          },
        };

        await updateProfileWS(data);
      } else {
        console.log('Agregar', currentProfile);
        const data = {
          bodyOptions: {
            codPerfil: currentProfile.codPerfil,
            nomPerfil: currentProfile.nomPerfil,
            obsPerfil: currentProfile.obsPerfil || '',
          },
        };
        // Agregar nuevo menú
        await createProfileWS(data);
      }
      getProfiles(); // Refrescar la lista de menús
      toggleModal(); // Cerrar el modal
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  // Funciones del App
  const toggleModal = (profile = null) => {
    // Comprobar null, undefined, 0, false, NaN
    setIsEditMode(!!profile);
    // Set el current profile para trabajar en el modal
    setCurrentProfile(profile || _defaultCurrentProfile);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };

  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    setCurrentProfile({
      ...currentProfile,
      [e.target.name]: e.target.value,
    });
  };

  // Filtrar usuarios según búsqueda
  const filteredProfiles = _profiles.filter(
    profile =>
      profile?.nomPerfil
        .toLowerCase()
        .includes(_searchingProfiles.toLowerCase()) ||
      profile?.obsPerfil
        .toLowerCase()
        .includes(_searchingProfiles.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  const currentItems = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeData = value => {
    setSearchingProfiles(value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  function renderPagination() {
    let pages = [];
    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev"
        className={`page-item pagination-prev ${
          currentPage === 1 ? 'disabled' : ''
        }`}
        to="#"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previo
      </Link>
    );
    // Mostrar la primera página siempre
    pages.push(
      <Link
        key="1"
        className={`page-item ${currentPage === 1 ? 'active' : ''}`}
        to="#"
        onClick={() => handlePageChange(1)}
      >
        1
      </Link>
    );
    // Si la página actual es mayor que 3, mostrar puntos suspensivos antes
    if (currentPage > 3) {
      pages.push(
        <span key="dots-prev" className="dots">
          ..
        </span>
      );
    }
    // Mostrar la página actual, o las dos páginas adyacentes
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <Link
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          to="#"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      );
    }
    // Si la página actual es más de 2 antes de la última, mostrar puntos suspensivos después
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots-next" className="dots">
          ..
        </span>
      );
    }
    // Mostrar la última página siempre
    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? 'active' : ''}`}
          to="#"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }
    // Agregar botón de "Siguiente"
    pages.push(
      <Link
        key="next"
        className={`page-item pagination-next ${
          currentPage === totalPages ? 'disabled' : ''
        }`}
        to="#"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Link>
    );

    return pages;
  }

  function _itemCount() {
    const _count =
      filteredProfiles.length > itemsPerPage
        ? itemsPerPage
        : filteredProfiles.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>
          {' '}
          Mostrando {_count} de {filteredProfiles.length}
        </span>
      </div>
    );
  }

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }}>
            ID
          </th>
          <th>Perfil</th>
          <th>Detalle</th>
          <th>Menús Asociados</th>
          <th className="d-flex justify-content-center">Acciones</th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map(profile => (
          <tr key={profile.codPerfil}>
            <td>{profile.codPerfil}</td>
            <td>{profile.nomPerfil}</td>
            <td>{profile?.obsPerfil ? profile.obsPerfil : 'Sin Detalle'}</td>
            <td>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => handleMenusRedirect(profile.codPerfil)}
              >
                <KUPIICONS.ListMenu height="18" width="18" />
              </Button>
            </td>
            <td>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => toggleModal(profile)}
              >
                <KUPIICONS.Pencil height="18" width="18" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <>
      <Container fluid>
        <Button
          color="primary"
          className="rounded-pill fw-bold btnAdd"
          onClick={() => toggleModal()}
        >
          <KUPIICONS.Plus />
        </Button>

        <Row className="g-0 align-items-center">
          <Col xl={12}>
            <Card className="bodyTable">
              <CardHeader>
                <h4 className="card-title mb-0">Listado de Perfiles</h4>
              </CardHeader>
              <CardBody>
                <Row className="g-0 d-flex justify-content-end">
                  <Col lg={4} xl={4}>
                    <div className="position-relative">
                      <Input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Buscar..."
                        id="search-options"
                        value={_searchingProfiles}
                        onChange={e => onChangeData(e.target.value)}
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

                <div className="table-responsive table-card mt-3 mb-1">
                  <table
                    className="table align-middle table-nowrap"
                    id="submenuTable"
                  >
                    {_tableTittles()}
                    {_tableBody()}
                  </table>

                  {filteredProfiles.length === 0 && (
                    <div className="noresult">
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: '75px', height: '75px' }}
                        />
                        <h5 className="mt-2">
                          ¡Lo sentimos! No se encontraron resultados
                        </h5>
                        <p className="text-muted mb-0">
                          No hemos encontrado perfiles que coincidan con tu búsqueda.
                          principal.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {
                  filteredProfiles.length > 0 && (
                    <div className="d-flex justify-content-between">
                      {_itemCount()}
                      <div className="pagination-wrap hstack gap-2">
                        {renderPagination()}
                      </div>
                    </div>
                  )
                }
              </CardBody>
            </Card>
            {/* Modal para agregar/editar menú */}
            <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
              <ModalHeader toggle={toggleModal} className="fw-bold">
                {isEditMode ? 'Editar Perfil' : 'Agregar Perfil'}
              </ModalHeader>
              <ModalBody className="p-4">
                <Form className="row">
                  <FormGroup className="col-12">
                    <Label for="codPerfil">ID</Label>
                    <Input
                      type="text"
                      name="codPerfil"
                      id="codPerfil"
                      placeholder="Agregar ID"
                      value={currentProfile.codPerfil}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-6">
                    <Label for="nomPerfil">Perfil</Label>
                    <Input
                      type="text"
                      name="nomPerfil"
                      id="nomPerfil"
                      placeholder="Agregar Perfil"
                      value={currentProfile.nomPerfil}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-6">
                    <Label for="obsPerfil">Detalle</Label>
                    <Input
                      type="text"
                      name="obsPerfil"
                      id="obsPerfil"
                      placeholder="Agregar Detalle"
                      value={currentProfile.obsPerfil}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color=""
                  onClick={toggleModal}
                  style={{
                    backgroundColor: '#DDF580',
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveProfile}
                  color="primary"
                >
                  {isEditMode ? 'Guardar' : 'Agregar'}
                </Button>{' '}
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
};
