import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserByFinancier, createUserByFinancier } from '../../../slices/users/thunk';
import { Card, CardBody, Col, Container, Row, CardHeader, Input, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, ModalFooter } from 'reactstrap';

// Components
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { formatSaldoCOP, toastDefault } from '../../../utilities';
import Spinners from '@/Components/Common/Spinner';


// Iconos
import KUPIICONS from '@/common/icons/icons';

//Estilo
import '@/pages/Menus/styles/index.scss';

export const ListUsersFinancer = () => {

  const { user } = useSelector(state => state.Login);
  const codFinanciadora = user.codEmpresa

  const _defaultUserFinanaicer = {
    numDocumento: '',
    nomUsuario: '',
    apeUsuario: '',
    telUsuario: '',
    emaUsuario: ''
  }

  // Use States
  const [_userFinancier, setUserFinancier] = useState([]);
  const [ currentUserFinancier, setCurrentUserFinancier ] = useState(_defaultUserFinanaicer)
  const [_searchingUserFinancier, setSearchingUserFinancier] = useState('');
  const [ showToast, setShowToast ] = useState(toastDefault);
  const [ loading, setLoading ] = useState([]);
  const [ error, setError ] = useState([]);

  
  const [ isModalOpen, setIsModalOpen ] = useState(false); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State para modal

  // Use effects
  useEffect(() => {
    if (codFinanciadora) {
      getUserFinancier();

    }
  }, [codFinanciadora]);


  // Web Services or Calling to Api
  const getUserFinancier = async () => {
    
    setLoading(true);
    setError(null);

    try {
      const data = { params: codFinanciadora };
      const response = await getUserByFinancier(data);

      setUserFinancier(response.data);

    } catch (err) {

      console.error('Error fetching payments means:', err);

    } finally {
    
      setLoading(false);
    }
  };

  
  const createUserFinancier = async () => {

    setShowToast({
      title  : "Procesando...",  
      message: "Por favor espere",
      type   : "",  
      isVisible: true
    });
    
    try {

      const data = {
        token: user.token,
        bodyOptions: {
          nomUsuario: currentUserFinancier.nomUsuario,
          apeUsuario: currentUserFinancier.apeUsuario,
          numDocumento: currentUserFinancier.numDocumento || 0,
          telUsuario: currentUserFinancier.telUsuario || '',
          emaUsuario: currentUserFinancier.emaUsuario || '',
        }
      }

      await createUserByFinancier(data)

      setShowToast({
        title: "Creado exitosamente",
        message: "El usuario ha sido creado.",
        type: "success",
        isVisible: true
      });

      toggleModal();
      getUserFinancier()

      setTimeout(() => {
        window.location.reload();
      }, 2000); 

    } catch (error) {
      console.error('Error saving user:', error);
    } 
  }

  // constantes internas
  const toggleModal = (userFinancier = null) => {
    setCurrentUserFinancier(userFinancier || _defaultUserFinanaicer);
    setIsModalOpen(!isModalOpen);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setCurrentUserFinancier({
      ...currentUserFinancier,
      [name]: value
    });
  };


  // Filtrar usuarios según búsqueda
  const filteredPaymentsMeans = _userFinancier.filter(
    userFinancier =>
      userFinancier?.nomCompleto.toLowerCase().includes(_searchingUserFinancier.toLowerCase()) ||
      String(userFinancier?.numDocumento || '').includes(_searchingUserFinancier)
  );


  const totalPages = Math.ceil(filteredPaymentsMeans.length / itemsPerPage);


  const currentItems = filteredPaymentsMeans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = page => {
    
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }

  };


  const onChangeData = value => {

    setSearchingUserFinancier(value);
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
      filteredPaymentsMeans.length > itemsPerPage
        ? itemsPerPage
        : filteredPaymentsMeans.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>
          {' '}
          Mostrando {_count} de {filteredPaymentsMeans.length}
        </span>
      </div>
    );
  }


  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }} className="text-center">
            ID
          </th>
          <th>Nombre</th>
          <th>Cédula</th>
          <th className="text-end">Cupo asignado</th>
          <th className="text-end">Cupo disponible</th>
          <th className="text-end">Bonos</th>
          <th className="text-center">Teléfono</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map(userFinancier => (
          <tr key={userFinancier.codUsuario}>
            <td className="text-center">{userFinancier.codUsuario}</td>
            <td>{userFinancier.nomCompleto}</td>
            <td>{userFinancier.numDocumento}</td>
            <td className="text-end"> { formatSaldoCOP (userFinancier.valCupoAsignado)}</td>
            <td className="text-end"> { formatSaldoCOP (userFinancier.valCupo)}</td>
            <td className="text-end">
              {userFinancier.valBono > 0 ? `$${userFinancier.valBono.toLocaleString()}` : userFinancier.valBono.toLocaleString() || 0}</td>
            <td className="text-center">{userFinancier.telUsuario}</td>
            
          </tr>
        ))}
      </tbody>
    );
  }


  function _modalAgregar() {
    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className='fw-bold'>Crear Usuario
        </ModalHeader>
        <ModalBody className='p-4'>
          <Form className='row'>
            <FormGroup className='col-12'>
              <Label for="numDocumento">Número de documento</Label>
              <Input
                type="number"
                name="numDocumento"
                id="numDocumento"
                placeholder='Agregar # documento'
                value={currentUserFinancier.numDocumento}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="nomUsuario">Nombre</Label>
              <Input
                type="text"
                name="nomUsuario"
                id="nomUsuario"
                placeholder='Agregar Nombre'
                value={currentUserFinancier.nomUsuario}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="apeUsuario">Apellidos</Label>
              <Input
                type="text"
                name="apeUsuario"
                id="apeUsuario"
                placeholder='Agregar Apellidos'
                value={currentUserFinancier.apeUsuario}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="telUsuario">Teléfono</Label>
              <Input
                type="text"
                name="telUsuario"
                id="telUsuario"
                placeholder='Agregar número de teléfono'
                value={currentUserFinancier.telUsuario}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="emaUsuario">Correo electrónico</Label>
              <Input
                type="text"
                name="emaUsuario"
                id="emaUsuario"
                placeholder='Agregar correo electrónico'
                value={currentUserFinancier.emaUsuario}
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
            onClick={createUserFinancier}
            color="primary"
          >
          Agregar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }


  
  const _tableListUserFinancier = () => {
    return (
      <div className='m-2'>
        <table className="table align-middle table-nowrap" id="tokensTable">
          {_tableTittles()}
          {_tableBody()}
        </table>
      </div>
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
                <h4 className="card-title mb-0">Lista de Usuarios por Financiadora</h4>
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
                        value={_searchingUserFinancier}
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
                {loading ? (
                  <div className="d-flex justify-content-center p-4">
                    <Spinners /> {/* Muestra el spinner mientras carga */}
                  </div>
                ) : error ? (
                  <p className="text-danger text-center">{error}</p> // Mensaje de error si falla la carga
                ) : (
                  _tableListUserFinancier()
                )}
                  {!loading && filteredPaymentsMeans.length === 0 && (
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
                  filteredPaymentsMeans.length > 0 && (
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
