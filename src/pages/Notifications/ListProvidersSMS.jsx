import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
} from 'reactstrap';
// Iconos
import KUPIICONS from '@/common/icons/icons';
import {
  getProvidersSMS,
  createProviderSMS,
  updateProviderSMS,
} from '@/slices/thunks';

export const ListProvidersSMS = () => {
  const dispatch = useDispatch();

  const _defaultProvider = {
    id: '',
    proveedor: '',
    funcion: '',
    orden: '',
    codEstado: 1,
  };

  const { providersSMS } = useSelector(state => state.Notifications);
  const [modalCreate, setModalCreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [provider, setProvider] = useState(_defaultProvider);
  const [_searchingProvider, setSearchingProvider] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const toggleCreate = (provider = null) => {
    // Si provider es null o undefined, !!provider será false e iremos a crear sino iremos a editar
    setIsEditMode(!!provider);
    // Si provider es null, utilizo _defaultProvider
    setProvider(provider || _defaultProvider);
    setModalCreate(!modalCreate);
  };


  useEffect(() => {
    dispatch(getProvidersSMS());
  }, [dispatch]);


  // Guardar un nuevo proveedor o actualiza uno existente
  const createCard = async () => {
    try {
      const data = {
        id: provider.id,
        proveedor: provider.proveedor,
        funcion: provider.funcion,
        codEstado: +provider.codEstado,
        orden: +provider.orden,
      };
      if (isEditMode) {
        dispatch(updateProviderSMS(data));
      } else {
        dispatch(createProviderSMS(data));
      }

      toggleCreate();
    } catch (err) {
      console.error('Error al guardar la tarjeta:', err);
    }
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    setProvider({
      ...provider,
      [e.target.name]: e.target.value,
    });
  };

  const filteredProvider = providersSMS.filter((provider) =>
    provider?.proveedor.toLowerCase().includes(_searchingProvider.toLowerCase()) ||  
    provider?.funcion.toLowerCase().includes(_searchingProvider.toLowerCase())
  );


  const totalPages = Math.ceil(filteredProvider.length / itemsPerPage);


  const currentItems = filteredProvider.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const onChangeData = (value) => {
    setSearchingProvider(value);
    setCurrentPage(1); // Reset to page 1 on search
  };
  

  function renderPagination() {
    let pages = [];
    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev" className={`page-item pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(currentPage - 1)}
      >
        Previo
      </Link>
    );
    // Mostrar la primera página siempre
    pages.push(
      <Link
        key="1"   className={`page-item ${currentPage === 1 ? 'active' : ''}`}
        to="#"    onClick={() => handlePageChange(1)}
      >
        1
      </Link>
    );  
    // Si la página actual es mayor que 3, mostrar puntos suspensivos antes
    if (currentPage > 3) {
      pages.push(<span key="dots-prev" className="dots">..</span>);
    } 
    // Mostrar la página actual, o las dos páginas adyacentes
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <Link
          key={i}  className={`page-item ${currentPage === i ? 'active' : ''}`}
          to="#"   onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      );
    }
    // Si la página actual es más de 2 antes de la última, mostrar puntos suspensivos después
    if (currentPage < totalPages - 2) {
      pages.push(<span key="dots-next" className="dots">..</span>);
    }
    // Mostrar la última página siempre
    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}  className={`page-item ${currentPage === totalPages ? 'active' : ''}`}
          to="#"  onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }
    // Agregar botón de "Siguiente"
    pages.push(
      <Link
        key="next" className={`page-item pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Link>
    );
  
    return pages;
  }


  function _itemCount(){
    const _count = (filteredProvider.length > itemsPerPage) ?  itemsPerPage : filteredProvider.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredProvider.length}</span>
      </div>
    );
  }
  

  function _tableTitles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }}>
            ID
          </th>
          <th>Proveedor</th>
          <th>Función</th>
          <th>Orden</th>
          <th>Estado</th>
          <th className="d-flex justify-content-center">Acciones</th>
        </tr>
      </thead>
    );
  }

  
  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems?.map(provider => (
          <tr key={provider.id}>
            <td>{provider.id}</td>
            <td>{provider.proveedor}</td>
            <td>{provider.funcion}</td>
            <td>{provider.orden}</td>
            <td>
              {provider.codEstado === 1 ? (
                <span className="badge bg-success p-2 fs-11">Activo</span>
              ) : (
                <span className="badge bg-danger p-2 fs-11">Inactivo</span>
              )}
            </td>
            <td className="d-flex justify-content-center align-items-center">
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => toggleCreate(provider)}
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
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Proveedores SMS" />
          <Button
            className="rounded-pill fw-bold btnAdd"
            onClick={() => toggleCreate()}
          >
            <KUPIICONS.Plus />
          </Button>
          <Row className="g-0 align-items-center">
            <Col xl={12}>
              <Card className="bodyTable">
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Listado de Proveedores SMS
                  </h4>
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
                          value={_searchingProvider}
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
                      {_tableTitles()}
                      {_tableBody()}
                    </table>

                  {filteredProvider.length === 0 && (
                    <div className="noresult">
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        />
                        <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                        <p className="text-muted mb-0">No hemos encontrado configuraciones de la App Kupi que coincidan con tu búsqueda.</p>
                      </div>
                    </div>
                  )}
                </div>

                { // Filtered Users
                  filteredProvider.length > 0 && (
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

              {/* Modal Create - Edit */}
              <Modal
                size="lg"
                isOpen={modalCreate}
                toggle={toggleCreate}
                centered
              >
                <ModalHeader toggle={toggleCreate} className="fw-bold">
                  {isEditMode ? 'Editar Proveedor' : 'Crear Proveedor'}
                </ModalHeader>
                <ModalBody className="p-4">
                  <Form className="row">
                    <FormGroup className="col-6">
                      <Label for="proveedor">Nombre del proveedor</Label>
                      <Input
                        type="text"
                        name="proveedor"
                        id="proveedor"
                        placeholder="Agrega el nombre del proveedor"
                        value={provider.proveedor}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup className="col-6">
                      <Label for="funcion">Función</Label>
                      <Input
                        type="text"
                        name="funcion"
                        id="funcion"
                        placeholder="Agrega la función"
                        value={provider.funcion}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup className="col-6">
                      <Label for="codEstado">Estado</Label>
                      <select
                        className="form-control"
                        name="codEstado"
                        id="codEstado"
                        value={provider.codEstado || '1'}
                        onChange={handleInputChange}
                      >
                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                    </FormGroup>

                    <FormGroup className="col-6">
                      <Label for="orden">Orden</Label>
                      <Input
                        type="number"
                        name="orden"
                        id="orden"
                        placeholder="Agrega un orden"
                        value={provider.orden}
                        min="0"
                        onChange={e => {
                          const value = e.target.value;
                          if (!value || parseInt(value, 10) >= 0) {
                            handleInputChange(e);
                          }
                        }}
                        required
                      />
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={toggleCreate}
                    style={{
                      backgroundColor: '#DDF580',
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={createCard}
                    style={{
                      backgroundColor: '#690BC8',
                      borderColor: '#690BC8',
                    }}
                  >
                    {isEditMode ? 'Guardar' : 'Agregar'}
                  </Button>{' '}
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
