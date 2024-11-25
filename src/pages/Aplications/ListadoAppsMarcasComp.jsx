import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppsMarcaCompWS, createAppMarcaCompWS } from '../../slices/parameterizationsApps/thunk';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, ModalFooter, FormGroup, Label, Modal, ModalHeader, ModalBody, Form } from 'reactstrap';

// Iconos
import KUPIICONS      from '@/common/icons/icons';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import AlertKupi from '@/Components/Common/alertsNotification/alert';

//Estilo
import '@/pages/Menus/styles/index.scss';
import { useNavigate } from 'react-router-dom';

export const ListadoAppsMarcasComp = () => {

  // Hook para redirigir a la marca detallada
  const navigate = useNavigate();

  const handleMarcaCompRedirect = (codApp) => {
    navigate(`/details-marca-compartida/${codApp}`);
  };
  
  const _defaultCurrentApp = {
    codApp: '',
    nomApp: '',
    codEmpresa: 0,
    imgLogo: ' ',
    imgHead: ' ',
    colApp1: ' ',
    colApp2: ' ',
    colApp3: ' ',
    colApp4: ' ',
    colApp5: ' ',
    colApp6: ' ',
    colApp1Nuevo: ' ',
    colApp2Nuevo: ' ',
    colApp3Nuevo: ' ',
    colApp4Nuevo: ' ',
    colApp5Nuevo: ' ',
    colApp6Nuevo: ' ',
    retiroSaldo: ' ',
    campo2: ' ',
    campo3: ' ',
    campo4: ' ',
    campo5: ' ',
    compromisos: 0,
    soat: 0,
    pasacupo: 0,
    recargas: 0,
    suscripciones: 0,
    paquetes: 0,
    usrCreacion: 0,
    fecCreacion: ' ',
    usrEdicion: 0,
    fecEdicion: ' ',
    registrar: 0,
    url_tyc: ' ',
    url_ptd: ' ',
    linea_purpura: ' ',
    soporte_tel: ' ',
    soporte_whatsapp: ' '
  }

  // Use States
  const [_marcaReducida, setMarcaReducida]    = useState([]);
  const [currentMarcaReducida, setCurrentMarcaReducida] = useState(_defaultCurrentApp);
  const [_searchingMarcaReducida, setSearchingMarcaReducida] = useState("");
  const [showAlert, setShowAlert] = useState({ title: "", message: "", isVisible: false });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  // Manejador del Alert
  const [showToast, setShowToast] = useState({ title  : "",  message: "", type   : "success",  isVisible: false });


  // Use effects
  useEffect(() => {
      getMarcaReducida();
  }, []);


  // Web Services or Calling to Api
  const getMarcaReducida = async () => {
    try {      

      const { data } = await getAppsMarcaCompWS();

      setMarcaReducida(data);

    } catch (err) {
      console.error('Error fetching info app marca reducida:', err);
    }
  }


  // Guardar nuevo perfil o actualizar existente
  const saveMarcaReducida = async () => {

    if (isNaN(Number(currentMarcaReducida.codApp)) || currentMarcaReducida.codApp === '') {
      setShowAlert({ title: " Error ", message: " El codApp debe ser un número ", isVisible: true });
      return;
    } 
    setShowAlert({ title: " Procesando... ", message: " Por favor espere", isVisible: true });

    try {
      // Obtenemos el usuario del localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const codUsuario = user?.codUsuario;
      // Generamos la fecha de creación actual en formato ISO
      const fecCreacion = new Date().toISOString();

      // Creamos el menú
      const data = {
        bodyOptions: {
          ...currentMarcaReducida, 
          usrCreacion: codUsuario,
          fecCreacion: fecCreacion
        }
      }

      await createAppMarcaCompWS(data);
      
      toggleModal(); // Cerrar el modal
      getMarcaReducida(); // Refrescar la lista de registros
      
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
  const toggleModal = (marcaReducida = null) => {
    // Set el current marcaReducida para trabajar en el modal
    setCurrentMarcaReducida(marcaReducida || _defaultCurrentApp);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMarcaReducida({
      ...currentMarcaReducida,
      [name]: value
    });
  };


  // Filtrar usuarios según búsqueda
  const filteredMarcaReducida = _marcaReducida.filter((marcaReducida) =>
    marcaReducida?.nomApp.toLowerCase().includes(_searchingMarcaReducida.toLowerCase())
  );


  const totalPages = Math.ceil(filteredMarcaReducida.length / itemsPerPage);


  const currentItems = filteredMarcaReducida.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const onChangeData = (value) => {
    setSearchingMarcaReducida(value);
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
    const _count = (filteredMarcaReducida.length > itemsPerPage) ?  itemsPerPage : filteredMarcaReducida.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredMarcaReducida.length}</span>
      </div>
    );
  }
  

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>Código App</th>
          <th>Nombre App</th>
          <th>Código Empresa</th>
          <th className='d-flex justify-content-center'>Acciones</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((marcaReducida) => (
          <tr key={marcaReducida.codApp}>
            <td>{marcaReducida.codApp}</td>
            <td>{marcaReducida.nomApp}</td>
            <td>{marcaReducida.codEmpresa}</td>
            <td>
              <Button 
                color="light rounded-pill p-2"
                className='gap-2 d-flex justify-content-center'
                onClick={() => handleMarcaCompRedirect(marcaReducida.codApp)}
                >
                <KUPIICONS.Eye height="18" width="18" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }


  function _modalAgregar() {

    return(
    <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal} className='fw-bold'> Agregar App
      </ModalHeader>
      <ModalBody className='p-4'>
        <Form className='row'>
          <FormGroup className='col-12'>
            <Label for="codApp">Código App</Label>
            <Input
              type="text"
              name="codApp"
              id="codApp"
              placeholder='Agregar Código App'
              value={currentMarcaReducida.codApp}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup className='col-12'>
            <Label for="nomApp">Nombre App</Label>
            <Input
              type="text"
              name="nomApp"
              id="nomApp"
              placeholder='Agregar Nombre App'
              value={currentMarcaReducida.nomApp}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup className='col-12'>
            <Label for="codEmpresa">Código Empresa</Label>
            <Input
              type="number"
              name="codEmpresa"
              id="codEmpresa"
              placeholder='Agregar Código Empresa'
              value={currentMarcaReducida.codEmpresa}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
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
        <Button 
        color="" 
        onClick={toggleModal}
        style={{ 
          backgroundColor: '#DDF580', 
        }}>
          Cancelar
        </Button>
        <Button 
          onClick={saveMarcaReducida}
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
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({
          title  : "",  message: "",
          type   : "success",  isVisible: false
        })} // Cerrar el toast
      />

      <Container fluid>
        {_modalAgregar()}
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
                <h4 className="card-title mb-0">Listado de Apps Marcas Compartidas</h4>
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
                        value={_searchingMarcaReducida}
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

                  {filteredMarcaReducida.length === 0 && (
                    <div className="noresult">
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        />
                        <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                        <p className="text-muted mb-0">No hemos encontrado aplicaciones que coincidan con tu búsqueda.</p>
                      </div>
                    </div>
                  )}
                </div>

                { filteredMarcaReducida.length > 0 && (
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