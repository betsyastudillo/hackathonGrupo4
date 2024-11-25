import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getAllPaymentsMeansWS, createPaymentMeansWS, updatePaymentMeansWS, deletePaymentMeansWS} from '../../../slices/payments/paymentsMeans/thunk';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, ModalFooter, FormGroup, Label, Modal, ModalHeader, ModalBody, Form } from 'reactstrap';

// Components
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { formatSaldoCOP, toastDefault } from '../../../utilities';

// Iconos
import KUPIICONS from '@/common/icons/icons';
import NoResult from '@/Components/Common/NoResult';

//Estilo
import '@/pages/Menus/styles/index.scss';

export const ListPaymentMeans = () => {

  const navigation = useNavigate();

  const _defaultPaymentMean = {
    id: '',
    nombre: '',
    operador: '',
    url_logo: '',
    costo: '',
    codEstado: '',
  };

  // Use States
  const [_paymentMean, setPaymentMean] = useState([]);
  const [currentPaymentMean, setCurrentPaymentMean] = useState(_defaultPaymentMean);
  const [_searchingPaymentMean, setSearchingPaymentMean] = useState('');
  const [ showToast, setShowToast ] = useState(toastDefault);

  const [showModal, setModal] = useState(false);
  const [_paymentMeanDelete, setPaymentMeanDelete] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Use effects
  useEffect(() => {
    getPaymentMean();
  }, []);

  // Web Services or Calling to Api
  const getPaymentMean = async () => {
    try {
      const { data } = await getAllPaymentsMeansWS();

      setPaymentMean(data);
    } catch (err) {

      console.error('Error fetching payments means:', err);
    }
  };


  // Guardar nuevo medio de pago o actualizar existente
  const savePaymentMean = async () => {
    
    try {

      if (isEditMode) {

        // Editar medio de pago
        const data = {
          params: currentPaymentMean.id,
          bodyOptions: {
            nombre: currentPaymentMean.nombre,
            operador: currentPaymentMean.operador || '',
            funcion: currentPaymentMean.funcion || '',
            costo: currentPaymentMean.costo || 0,
            url_logo: currentPaymentMean.url_logo || '',
            codEstado: currentPaymentMean.codEstado,
          },
        };
        console.log("data editar", data)
        await updatePaymentMeansWS(data);
      
      } else {
      
        const data = {
          bodyOptions: {
            nombre: currentPaymentMean.nombre,
            operador: currentPaymentMean.operador || '',
            funcion: currentPaymentMean.funcion || '',
            costo: currentPaymentMean.costo || 0,
            url_logo: currentPaymentMean.url_logo || '',
            codEstado: 1,
          },
        };
        console.log("data", data)
        // Agregar medio de pago
        await createPaymentMeansWS(data);
      }

      getPaymentMean(); // Refrescar la lista de menús
      toggleModal(); // Cerrar el modal

    } catch (err) {
      console.error('Error saving payment mean:', err);
    }
  };


  // Funciones del App
  const toggleModal = (paymentMean = null) => {
    // Comprobar null, undefined, 0, false, NaN
    setIsEditMode(!!paymentMean);
    // Set el current paymentMean para trabajar en el modal
    setCurrentPaymentMean(paymentMean || _defaultPaymentMean);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    setCurrentPaymentMean({
      ...currentPaymentMean,
      [e.target.name]: e.target.value,
    });
  };

  const _handlerDeletePaymentMean = (paymentMean) => {
    // e.preventDefault();

    setPaymentMeanDelete(paymentMean);
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
      const { id } = _paymentMeanDelete;

      const data = {
        params: id,
        bodyOptions: {
        },
      };

      if (!id) {
        console.error('No se ha encontrado el id del medio de pago a eliminar');
        return;
      }

      await deletePaymentMeansWS(data);

      // Actualizar la lista de medios de pago después de la eliminación
      getPaymentMean();

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
  const filteredPaymentsMeans = _paymentMean.filter(
    paymentMean =>
      paymentMean?.nombre.toLowerCase().includes(_searchingPaymentMean.toLowerCase()) ||
      paymentMean?.url_logo.toLowerCase().includes(_searchingPaymentMean.toLowerCase())
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

    setSearchingPaymentMean(value);
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


  const toggle = () => {
    setModal(!showModal);
    setPaymentMeanDelete({});
  };


  // Modal de Eliminar
  function _modalDelete() {
    return (
      <Modal isOpen={showModal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}> ¿Desea eliminar este medio de pago? </ModalHeader>
        <ModalBody>
          <NoResult
            tittle={_paymentMeanDelete?.nombre}
            message={_paymentMeanDelete?.url_logo}
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


  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }}>
            ID
          </th>
          <th>Nombre</th>
          <th>Operador</th>
          <th>Función</th>
          <th>Costo</th>
          <th>URL</th>
          <th className="d-flex justify-content-center">Acciones</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map(paymentMean => (
          <tr key={paymentMean.id}>
            <td>{paymentMean.id}</td>
            <td>{paymentMean.nombre}</td>
            <td>{paymentMean.operador}</td>
            <td>{paymentMean?.funcion ? paymentMean.funcion : 'No especificada'}</td>
            <td className='text-end'>{ formatSaldoCOP(paymentMean.costo)}</td>
            <td>{paymentMean?.url_logo ? paymentMean.url_logo : 'No especificada'}</td>
            <td className='d-flex justify-content-around'>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center pr-3"
                onClick={() => toggleModal(paymentMean)}
              >
                <KUPIICONS.Pencil height="18" width="18" />
              </Button>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => _handlerDeletePaymentMean(paymentMean)}
              >
                <KUPIICONS.Trash2 height="18" width="18" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }


  function _modalOptions() {
    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className="fw-bold">
          {isEditMode ? 'Editar Medio de Pago' : 'Agregar Medio de Pago'}
        </ModalHeader>
        <ModalBody className="p-4">
          <Form className="row">
            <FormGroup className="col-12">
              <Label for="nombre">Nombre</Label>
              <Input
                type="text"
                name="nombre"
                id="nombre"
                placeholder="Agregar Nombre"
                value={currentPaymentMean.nombre}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className="col-12">
              <Label for="operador">Operador</Label>
              <Input
                type="text"
                name="operador"
                id="operador"
                placeholder="Agregar Operador"
                value={currentPaymentMean.operador}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className="col-12">
              <Label for="funcion">Función</Label>
              <Input
                type="text"
                name="funcion"
                id="funcion"
                placeholder="Agregar Función"
                value={currentPaymentMean.funcion}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className="col-12">
              <Label for="costo">Costo</Label>
              <Input
                type="number"
                name="costo"
                id="costo"
                placeholder="Agregar Costo"
                value={currentPaymentMean.costo}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className="col-12">
              <Label for="url_logo">URL</Label>
              <Input
                type="text"
                name="url_logo"
                id="url_logo"
                placeholder="Agregar URL"
                value={currentPaymentMean.url_logo}
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
            onClick={savePaymentMean}
            color="primary"
          >
            {isEditMode ? 'Guardar' : 'Agregar'}
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
        {_modalDelete()}
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
                <h4 className="card-title mb-0">Medios de pago externos</h4>
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
                        value={_searchingPaymentMean}
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

                  {filteredPaymentsMeans.length === 0 && (
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
