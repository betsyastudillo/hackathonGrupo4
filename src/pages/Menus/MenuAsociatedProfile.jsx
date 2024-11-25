import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getMenusAssociatedWS,
  getAllSubmenusWS,
  addSubmenusWS,
  deleteSubmenusWS,
} from '../../slices/menus/thunk';
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
  Modal,
  ModalHeader,
  ModalBody,
  Form,
} from 'reactstrap';

// Iconos
import KUPIICONS from '@/common/icons/icons';
import NoResult from '@/Components/Common/NoResult';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import SearchableSelect from '@/Components/Common/select/searchableSelect';

//Estilo
import '@/pages/Menus/styles/index.scss';

export const _MenusAssociatedProfileView = () => {
  // Obtenemos de los parámetros el codMenuPrincipal
  const { codPerfil } = useParams();
  const navigation = useNavigate();

  const _defaultCurrentMenuAssociated = {
    codPerfil: codPerfil,
    idSubmenu: '',
    nomSubmenu: '',
    ordenSubmenu: '',
    urlSubmenu: '',
    codMenuPrincipal: '',
    nomMenu: '',
    idMenu: '',
  };

  // Use States
  const [_menusAssociatedProfile, setMenusAssociatedProfiles] = useState([]);
  const [currentMenusAssociated, setCurrentMenusAssociated] = useState(
    _defaultCurrentMenuAssociated
  );
  const [menusCompleto, setMenusCompletos] = useState([]);
  const [_searchingMenusAssociated, setSearchingMenusAssociated] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [showModal, setModal] = useState(false);
  const [_MenusDelete, setMenusDelete] = useState({});

  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Manejador del Alert
  const [showToast, setShowToast] = useState({
    title: '',
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Use effects
  useEffect(() => {
    if (codPerfil) {
      getMenusAssociated(codPerfil);
      getMenusCompletos();
    }
  }, [codPerfil]);

  // Web Services or Calling to Api
  const getMenusAssociated = async codPerfil => {
    try {
      const { data } = await getMenusAssociatedWS({
        params: codPerfil,
        bodyOptions: [],
      });
      
      setMenusAssociatedProfiles(data);
    } catch (err) {
      console.error('Error fetching menus associated:', err);
    }
  };

  // Web Service para traer los submenú
  const getMenusCompletos = async () => {
    try {
      const { data } = await getAllSubmenusWS();

      const menusCompletos = data.map(menu => ({
        idSubmenu: menu.idSubmenu,
        nomSubmenu: menu.nomSubmenu,
        idMenu: menu.idMenu,
        nomMenu: menu.nomMenu,
      }));

      setMenusCompletos(menusCompletos);
    } catch (err) {
      console.error('Error fetching submenus:', err);
    }
  };

  // Guardar nuevo menú o actualizar existente
  const saveMenusAssociated = async () => {
    setShowToast({
      title: 'Procesando...',
      message: 'Por favor espere',
      type: '',
      isVisible: true,
    });

    try {
      const data = {
        bodyOptions: {
          codPerfil: currentMenusAssociated.codPerfil,
          codMenuSecundario: currentMenusAssociated.idSubmenu,
        },
      };
      // Agregar nuevo menú
      await addSubmenusWS(data);

      toggleModal(); // Cerrar el modal
      navigation(0); //Si todo sale bien, se recarga la página
    } catch (error) {
      const { response } = error;
      console.log(response);
      const jsonString = JSON.stringify(response.data, null, 2);

      setShowToast({
        title: `Error ${response?.status || 'desconocido'}`,
        message: jsonString,
        type: 'danger',
        isVisible: true,
      });
    }
  };

  // Funciones del App
  const toggleModal = (menusAssociated = null) => {
    // Set el current menusAssociated para trabajar en el modal
    setCurrentMenusAssociated(menusAssociated || _defaultCurrentMenuAssociated);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };

  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    const [idMenu, idSubmenu, nomSubmenu] = e.split('-');

    setCurrentMenusAssociated({
      ...currentMenusAssociated,
      idMenu,
      idSubmenu,
      nomSubmenu,
    });
  };

  const _handlerDeleteUser = (e, filteredMenusAssociated) => {
    e.preventDefault();

    setMenusDelete(filteredMenusAssociated);
    setModal(!showModal);
  };

  // Maneja la eliminación llamando a la API
  const _handleConfirmDelete = async () => {
    setShowToast({
      title: 'Procesando...',
      message: 'Por favor espere',
      type: '',
      isVisible: true,
    });

    try {
      const { idMenuPerfiles } = _MenusDelete;

      if (!idMenuPerfiles) {
        console.error('No se ha encontrado el id del menú asociado a eliminar');
        return;
      }

      await deleteSubmenusWS(idMenuPerfiles);

      // Actualizar la lista de menús asociados después de la eliminación
      getMenusAssociated(codPerfil);

      setModal(false);
      navigation(0);
    } catch (error) {
      const { response } = error;
      console.log(response);
      const jsonString = JSON.stringify(response.data, null, 2);

      setShowToast({
        title: `Error ${response?.status || 'desconocido'}`,
        message: jsonString,
        type: 'danger',
        isVisible: true,
      });
    }
  };

  // Filtrar usuarios según búsqueda
  const filteredMenusAssociated = _menusAssociatedProfile.filter(
    menusAssociated =>
      menusAssociated?.nomSubmenu
        .toLowerCase()
        .includes(_searchingMenusAssociated.toLowerCase()) ||
      menusAssociated?.urlSubmenu
        .toLowerCase()
        .includes(_searchingMenusAssociated.toLowerCase()) ||
      menusAssociated?.nomMenu
        .toLowerCase()
        .includes(_searchingMenusAssociated.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMenusAssociated.length / itemsPerPage);

  const currentItems = filteredMenusAssociated.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeData = value => {
    setSearchingMenusAssociated(value);
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
      filteredMenusAssociated.length > itemsPerPage
        ? itemsPerPage
        : filteredMenusAssociated.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>
          {' '}
          Mostrando {_count} de {filteredMenusAssociated.length}
        </span>
      </div>
    );
  }

  const toggle = () => {
    setModal(!showModal);
    setMenusDelete({});
  };

  // Modal de Eliminar
  function _modalDelete() {
    return (
      <Modal isOpen={showModal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}> ¿Desea eliminar este menú? </ModalHeader>
        <ModalBody>
          <NoResult
            tittle={_MenusDelete?.nomMenu}
            message={_MenusDelete?.nomSubmenu}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color=""
            onClick={toggle}
            style={{
              backgroundColor: '#DDF580',
            }}
          >
            Cancelar
          </Button>
          <Button color="primary" onClick={_handleConfirmDelete}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  // Encabezados de las tablas
  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>Menú Principal</th>
          <th>Submenú</th>
          <th>Orden Submenú</th>
          <th>Url Submenú</th>
          <th className="d-flex justify-content-center">Acciones</th>
        </tr>
      </thead>
    );
  }

  // Cuerpos de las tablas
  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map(menusAssociated => (
          <tr key={menusAssociated.codPerfil}>
            <td>{menusAssociated.nomMenu}</td>
            <td>{menusAssociated.nomSubmenu}</td>
            <td>
              {menusAssociated?.ordenSubmenu
                ? menusAssociated.ordenSubmenu
                : '0'}
            </td>
            <td>
              {menusAssociated?.urlSubmenu
                ? menusAssociated.urlSubmenu
                : 'Sin Url asignada'}
            </td>
            <td>
              <div
                className="gap-2 d-flex justify-content-center"
                onClick={e => _handlerDeleteUser(e, menusAssociated)}
              >
                <KUPIICONS.Trash2 />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  const menusAssociatedOptions = menusCompleto.map(menus => ({
    value: `${menus.idMenu}-${menus.idSubmenu}-${menus.nomSubmenu}`,
    label: `${menus.nomMenu} - ${menus.nomSubmenu}`,
  }));

  function _modalAdd() {
    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className="fw-bold">
          Agregar Submenú
        </ModalHeader>
        <ModalBody className="p-4">
          <Form className="row">
            <FormGroup className="col-12">
              <SearchableSelect
                title="Submenús"
                options={menusAssociatedOptions}
                placeholder="Selecciona un menú..."
                onChange={handleInputChange}
                selectedValue={`${currentMenusAssociated.idMenu}-${currentMenusAssociated.idSubmenu}-${currentMenusAssociated.nomSubmenu}`}
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
            onClick={saveMenusAssociated}
            color="primary"
          >
            Agregar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <>
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() =>
          setShowToast({
            title: '',
            message: '',
            type: 'success',
            isVisible: false,
          })
        } // Cerrar el toast
      />
      <Container fluid>
        {_modalDelete()}
        {_modalAdd()}
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
                <h4 className="card-title mb-0">Lista de Menús Asociados</h4>
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
                        value={_searchingMenusAssociated}
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

                  {_menusAssociatedProfile.length === 0 && (
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
                          No hemos encontrado menús asociados al perfil
                          seleccionado que coincidan con tu búsqueda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {
                  // Filtered Users
                  filteredMenusAssociated.length > 0 && (
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
          </Col>
        </Row>
      </Container>
    </>
  );
};
