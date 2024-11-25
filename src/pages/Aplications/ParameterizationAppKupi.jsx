import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getInfoAppKupiWS, updateInfoAppKupiWS, createInfoAppKupiWS } from '../../slices/parameterizationsApps/thunk';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, ModalFooter, FormGroup, Label, Modal, ModalHeader, ModalBody, Form } from 'reactstrap';

// Iconos
import KUPIICONS      from '@/common/icons/icons';
import ToastKupi from '@/Components/Common/alertsNotification/toast';

//Estilo
import '@/pages/Menus/styles/index.scss';

export const ParametrizacionesAppKupi = () => {

  const _defaultCurrentInfoAppKupi = {
    id: '',
    llave: '',
    valor: '',
  }

  // Use States
  const [_infoAppKupi, setInfoAppKupi] = useState([]);
  const [currentInfoAppKupi, setCurrentInfoAppKupi] = useState(_defaultCurrentInfoAppKupi);
  const [_searchingInfoAppKupi, setSearchingInfoAppKupi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditMode, setIsEditMode]   = useState(false); 
  // Manejador del Alert
  const [showToast, setShowToast] = useState({
    title  : "",  message: "",
    type   : "success",  isVisible: false
  });


  // Use effects
  useEffect(() => {
      getInfoAppKupi();
  }, []);


  // Web Services or Calling to Api
  const getInfoAppKupi = async () => {
    try {      

      const { data } = await getInfoAppKupiWS();

      setInfoAppKupi(data);

    } catch (err) {
      console.error('Error fetching info app kupi:', err);
    }
  }


  // Guardar nuevo perfil o actualizar existente
  const saveInfoAppKupi = async () => {

    setShowToast({
      title  : "Procesando...",  message: "Por favor espere",
      type   : "",  isVisible: true
    });

    try {
      if (isEditMode) {
        // Editar menú existente
        const data = {
          params: currentInfoAppKupi.id,
          bodyOptions: {
            llave  : currentInfoAppKupi.llave,
            valor : currentInfoAppKupi.valor  || "",
          }
        }
        console.log("data editar", data)
        await updateInfoAppKupiWS(data);

      } else {
        console.log("Agregar", currentInfoAppKupi)
        const data = {
          bodyOptions: {
            llave : currentInfoAppKupi.llave,
            valor: currentInfoAppKupi.valor || ""
          }
        }
        console.log("data crear", data)

        // Agregar nuevo menú
        await createInfoAppKupiWS(data);

      }

      getInfoAppKupi(); // Refrescar la lista de registros
      toggleModal(); // Cerrar el modal
    
    } catch (error) {

      const { response } = error;
      console.log(response);
      const jsonString = JSON.stringify(response.data, null, 2);

      setShowToast({
        title  :  `Error ${response?.status || 'desconocido'}`, 
        message: jsonString,
        type   : "danger",  isVisible: true
      });
    }
  };


  // Funciones del App
  const toggleModal = (appKupi = null) => {
    // Comprobar null, undefined, 0, false, NaN
    setIsEditMode(!!appKupi);
    // Set el current appKupi para trabajar en el modal
    setCurrentInfoAppKupi(appKupi || _defaultCurrentInfoAppKupi);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = (e) => {
    setCurrentInfoAppKupi({
      ...currentInfoAppKupi,
      [e.target.name]: e.target.value
    });
  };


  // Filtrar según búsqueda
  const filteredInfoAppKupi = _infoAppKupi.filter((appKupi) =>
    appKupi?.llave.toLowerCase().includes(_searchingInfoAppKupi.toLowerCase()) ||  
    appKupi?.valor.toLowerCase().includes(_searchingInfoAppKupi.toLowerCase())
  );


  const totalPages = Math.ceil(filteredInfoAppKupi.length / itemsPerPage);


  const currentItems = filteredInfoAppKupi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const onChangeData = (value) => {
    setSearchingInfoAppKupi(value);
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
    const _count = (filteredInfoAppKupi.length > itemsPerPage) ?  itemsPerPage : filteredInfoAppKupi.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredInfoAppKupi.length}</span>
      </div>
    );
  }
  

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Llave</th>
          <th>Valor</th>
          <th className='d-flex justify-content-center'>Acciones</th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((appKupi) => (
          <tr key={appKupi.id}>
            <td>{appKupi.id}</td>
            <td>{appKupi.llave}</td>
            <td>{appKupi.valor}</td>
            <td>
              <Button 
                color="light rounded-pill p-2"
                className='gap-2 d-flex justify-content-center'
                onClick={() => toggleModal(appKupi)}
                >
                <KUPIICONS.Pencil height="18" width="18" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }


  function _modalOptions() {

    return(
    <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal} className='fw-bold'>
        {isEditMode ? 'Editar Registro' : 'Agregar Registro'}
      </ModalHeader>
      <ModalBody className='p-4'>
        <Form className='row'>
          <FormGroup className='col-12'>
            <Label for="llave">Llave</Label>
            <Input
              type="text"
              name="llave"
              id="llave"
              placeholder='Agregar Llave'
              value={currentInfoAppKupi.llave}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup className='col-12'>
            <Label for="valor">Valor</Label>
            <Input
              type="text"
              name="valor"
              id="valor"
              placeholder='Agregar Valor'
              value={currentInfoAppKupi.valor}
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
        }}>
          Cancelar
        </Button>
        <Button 
          onClick={saveInfoAppKupi}
          color="primary"
        >
          {isEditMode ? 'Guardar' : 'Agregar'}
        </Button>{' '}
      </ModalFooter>
    </Modal>
    );
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
        {_modalOptions()}
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
                <h4 className="card-title mb-0">Listado de Registros en App Kupi</h4>
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
                        value={_searchingInfoAppKupi}
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

                <div className="table-responsive table-card mt-3 mb-1">
                  <table className="table align-middle table-nowrap" id="submenuTable">
                    {_tableTittles()}
                    {_tableBody()}
                  </table>

                  {filteredInfoAppKupi.length === 0 && (
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
                  filteredInfoAppKupi.length > 0 && (
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