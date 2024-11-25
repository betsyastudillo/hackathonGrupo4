import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, Col, CardBody, Row,  Modal, ModalHeader, ModalBody, ModalFooter, Container, Input, Form, FormGroup, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

import { getAllPushWS, getPushDetWS, updatePushWS } from '../../../slices/notifications/Push/thunk';

import KUPIICONS from '@/common/icons/icons';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../../utilities';
import Spinners from '@/Components/Common/Spinner';


export const _PushNotificationsView = () => {
  
  // Manejador de la tabla
  const [listPush, setListPush] = useState([]);
  const [pushDetail, setPushDetail] = useState([]);
  const [_searchingPush, setSearchingPush] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(toastDefault);
  const [ loading, setLoading ] = useState([]);
  const [ error, setError ] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!_searchingPush) {
      // Solo llama a `fetchPush` si no hay búsqueda activa
      fetchPush(currentPage);
    } else {
      // Si hay un término de búsqueda, carga todos los datos para filtrar localmente
      fetchPush(1); 
    }
  }, [currentPage, _searchingPush]);
  

  // Maneja la búsqueda de las notificaciones push
  const fetchPush = async (page) => { 

    setLoading(true);
    setError(null);

    try {

      let response;

      if(_searchingPush && _searchingPush.trim() !== '') { //Nos aseguramos que no llegue vacío
        // Si no hay búsqueda activa, carga todos los datos
        response = await getAllPushWS(null);

      } else {
        // Si no hay búsqueda activa, carga la página solicitada
        response = await getAllPushWS(page);
      }
      
      if (response?.data?.data && response?.data?.meta) {
        setListPush(response.data.data);
        setTotalItems(response.data.meta.totalItems);
        setTotalPages(response.data.meta.totalPages); //Inicialmente los elementos filtrados son todos
        setCurrentItems(response.data.data);

      } else {
        console.warn("Formato de respuesta inesperado:", response); // Advierte si la estructura es incorrecta
      }

    } catch (error) {
      console.error('Error fetching information:', error);
      setError("Error al cargar los datos de bonos. Inténtalo de nuevo más tarde.");
      
    } finally {

      setLoading(false);
    }
  };
  

  const getFilteredPush = () => {
    if (!_searchingPush) {
      return currentItems;
    }

    const filtered = listPush.filter((push) => 
      push?.titMensaje.toLowerCase().includes(_searchingPush.toLowerCase()) ||
      push?.desMensaje.toLowerCase().includes(_searchingPush.toLowerCase()) ||
      push?.urlImagen.toLowerCase().includes(_searchingPush.toLowerCase()) ||
      String(push?.fecEnvio || '').includes(_searchingPush)
    );

    return filtered;
  };


  const getPushDet = async (codPush) => {
    try {
      const dataRequest = {
        params: codPush
      }
      const { data } = await getPushDetWS(dataRequest);
      setPushDetail(data);
      
    } catch (err) {
      console.error('Error fetching push details:', err);
      setShowToast({ 
        title: " Error" + err.status, 
        message: JSON.stringify(err.data.message || "Ocurrió un error inesperado", null, 2), 
        isVisible: true 
      });
    } 
  };


  const updatePush = async () => {
    
    const data = {
      params: pushDetail.codPush,
      bodyOptions: {
        titMensaje: pushDetail.titMensaje || '',
        desMensaje: pushDetail.desMensaje || '',
        urlImagen: pushDetail.urlImagen || '',
      }
    }
    await updatePushWS(data);
    toggleEditModal();
    fetchPush(currentPage);
  }

// Modal del detalle
  const toggleDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
  };
  
  
  // Modal de edición
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);

      if (!_searchingPush) {
        // Solo llama a `fetchPush` si no hay búsqueda activa
        fetchPush(newPage);
      }
    }
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setPushDetail({
      ...pushDetail,
      [name]: value
    });

  };


  const onChangeData = (value) => {

    setSearchingPush(value);
    setCurrentPage(1);
  };


  function renderPagination() {
    let pages = [];
    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev" 
        className={`page-item pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
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
        key="next" 
        className={`page-item pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
        to="#"     
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Link>
    );
  
    return pages;
  }

  
  function _itemCount() {
    const filteredItems = getFilteredPush();
    const _count = filteredItems.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>Mostrando {_count} de {totalItems}</span>
      </div>
    );
  }
  

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Título</th>
          <th>Mensaje</th>
          <th>Android</th>
          <th>IOS</th>
          <th>URL</th>
          <th className='text-center'>Acciones</th>
        </tr>
      </thead>
    )
  }


  function _tableBody() {
    const items = getFilteredPush();
    return (
      <tbody className="list form-check-all">
        {items.map((push) => (
            <tr key={push.codPush}>
              <td>{push.codPush}</td>
              <td>{push.fecEnvio}</td>
              <td>{push.titMensaje}</td>
              <td>{push.desMensaje}</td>
              <td>{push.android}</td>
              <td>{push.ios}</td>
              <td>{push?.urlImagen || "No diligenciada"}</td>
              <td>
                <Button 
                  color=''
                  style={{
                    marginRight:'10px',
                    borderRadius: '50%'
                  }}
                  onClick={() => {
                                  getPushDet(push.codPush)
                                  toggleDetailModal();
                                }}>
                  <KUPIICONS.Eye height="18" width="18" />
                </Button>
                <Button 
                  color=''
                  style={{
                    borderRadius: '50%'
                  }}
                  onClick={() => {
                                  getPushDet(push.codPush)
                                  toggleEditModal();
                                }}>
                  <KUPIICONS.Pencil height="18" width="18" stroke="#690BC8" />
                </Button>
              </td>
            </tr>
          ))
          }
      </tbody>
    )
  }


  function _modalDetail() {
    return(
      <Modal isOpen={isDetailModalOpen} toggle={toggleDetailModal} centered>
      <ModalHeader toggle={toggleDetailModal} className='fw-bold'>
        Detalles del Push
      </ModalHeader>
      <ModalBody>
        {pushDetail ? (
          <div>
            <p><strong>ID:</strong> {pushDetail.codPush}</p>
            <p><strong>Fecha:</strong> {pushDetail.fecEnvio}</p>
            <p><strong>Título:</strong> {pushDetail.titMensaje}</p>
            <p><strong>Mensaje:</strong> {pushDetail.desMensaje}</p>
            <p><strong>Android:</strong> {pushDetail.android}</p>
            <p><strong>iOS:</strong> {pushDetail.ios}</p>
            <p><strong>URL Imagen:</strong> {pushDetail.urlImagen || "No diligenciada"}</p>
          </div>
        ): (
          <p>Cargando detalles...</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button 
          color="" 
          onClick={toggleDetailModal}
          style={{ 
            backgroundColor: '#DDF580', 
          }}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
    );
  }


  function _modalEdit() {

    return (
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal} centered>
      <ModalHeader toggle={toggleEditModal} className='fw-bold'>
        Editar Notificación Push
      </ModalHeader>
        <ModalBody className='p-4'>
          <Form className='row'>
            <FormGroup className='col-12'>
              <Label for="titMensaje">Título</Label>
              <Input
                type="text"
                name="titMensaje"
                id="titMensaje"
                value={pushDetail.titMensaje}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="desMensaje">Descripción</Label>
              <Input
                type="text"
                name="desMensaje"
                id="desMensaje"
                value={pushDetail.desMensaje}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="urlImagen">URL</Label>
              <Input
                type="text"
                name="urlImagen"
                id="urlImagen"
                value={pushDetail.urlImagen}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
          color="" 
          onClick={toggleEditModal}
          style={{ 
            backgroundColor: '#DDF580', 
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={updatePush}
            color="primary"
          >
            Guardar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    )
  }


  return (
    <>
    <ToastKupi
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({
          title  : "",  message: "",
          type   : "success",  isVisible: false
        })} // Cerrar el toast
      />
    <Container fluid>
      {_modalDetail()}
      {_modalEdit()}
      <Row className="g-0 align-items-center">
        <Col xl={12}>
          <Card className="bodyTable">
            <CardHeader>
              <h4 className="card-title mb-0">Listado de Notificaciones Push</h4>
            </CardHeader>
            <CardBody>
              <div className="listjs-table" id="customerList">
                <Row className="g-0 d-flex justify-content-end">
                  <Col lg={4} xl={4}>
                  <div className="position-relative">
                    <div className="search-box ms-2">
                      <Input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Buscar..."
                      id="search-options"
                      value={_searchingPush}
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
                  </div>
                </Col>
              </Row>
              </div>
              <div className="table-responsive table-card mt-3 mb-1">
                {loading ? ( 
                  <div className="d-flex justify-content-center p-4">
                  <Spinners /> {/* Muestra el spinner mientras carga */}
                </div>
              ) : error ? (
                <p className="text-danger text-center">{error}</p> // Mensaje de error si falla la carga
              ) : (
                <table className="table align-middle table-nowrap">
                  {_tableTittles()}
                  {_tableBody()}
                </table>
                )}
                {!loading && getFilteredPush().length === 0 && (
                  <div className="noresult">
                    <div className="text-center">
                      <lord-icon
                        src="https://cdn.lordicon.com/msoeawqm.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "75px", height: "75px" }}
                      />
                      <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                      <p className="text-muted mb-0">No hemos encontrado notificaciones push que coincidan con tu búsqueda.</p>
                    </div>
                  </div>
                )}
              </div>

              { 
                getFilteredPush().length > 0 && (
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
}