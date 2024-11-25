import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Col, Container, Row, Button, CardHeader, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { getPushUploadWS, countPushUploadDetWS } from '../../../slices/notifications/Push/thunk';

import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../../utilities';

export const _SendMassivePushView = () => {

  const navigate = useNavigate();

  const handleDetailsPush = (codUpload, codEstadoUpload) => {
    console.log("up", codUpload)
    console.log("est", codEstadoUpload)
    navigate(`/detail-massive-push/${codUpload}/${codEstadoUpload}`)
  }
  
  const [ listPush, setListPush ] = useState([]);
  const [ countPush, setCountPush ] = useState([]);
  const [filteredPush, setFilteredPush] = useState([]);
  const [ showToast, setShowToast ] = useState(toastDefault);
  const [ isModalOpen, setIsModalOpen ] = useState(false); 
  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [fileCSV, setFileCSV] = useState('');
  const [fileImage, setFileImage] = useState('');
  const [separator, setSeparator] = useState('puntoycoma');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        await getListPushUpload();
      } catch (error) {
        console.error("Error al obtener la lista inicial:", error);
      }
    };
  
    fetchData();
  }, []); // Sin dependencias para ejecutarse solo al montar.
  
  const currentItems = listPush.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  useEffect(() => {
    const fetchCountData = async () => {
      try {
        const visibleItems = currentItems.map((push) => push.codUpload);
        const counts = await Promise.all(
          visibleItems.map((codUpload) => getCountPushUpload(codUpload))
        );
  
        const newCounts = counts.reduce((acc, { codUpload, data }) => {
          acc[codUpload] = data;
          return acc;
        }, {});
        setCountPush((prev) => ({ ...prev, ...newCounts }));
      } catch (error) {
        console.error("Error al cargar conteos:", error);
      }
    };
  
    if (currentItems.length > 0) {
      fetchCountData();
    }
  }, [currentItems]); // Dependencias: solo los elementos visibles.
  
  
  const getListPushUpload = async () => {

    try {

      const { data } = await getPushUploadWS();

      setListPush(data);

    } catch (error) {
      console.error('Error fetching types token:', error);
    }
  }


  const getCountPushUpload = async (codUpload) => {
    try {
      const dataRequest = { params: codUpload };
      const { data } = await countPushUploadDetWS(dataRequest);
      return { codUpload, data }; // Devuelves el `codUpload` asociado para facilitar el manejo.
    } catch (error) {
      console.error("Error al obtener detalles del push upload:", error);
      return { codUpload, data: [] }; // Devuelves un valor vacío en caso de error.
    }
  };
  

  const filterByEstado = (codUpload, codEstadoUpload) => {

    const uploadData = countPush[codUpload] || [];
    const filtered = uploadData.filter((item) => item.codEstadoUpload === codEstadoUpload);
    console.log("filter", filtered)
    setFilteredPush(filtered); 
  };
  

  // constantes internas
  const toggleModal = () => {
    // setCurrentUserFinancier(userFinancier || _defaultUserFinanaicer);
    setIsModalOpen(!isModalOpen);
  };

  
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
    
  //   setCurrentUserFinancier({
  //     ...currentUserFinancier,
  //     [name]: value
  //   });
  // };

  
  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file ? file.name : '');
  };


  const totalPages = Math.ceil(listPush.length / itemsPerPage);


  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
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
      listPush.length > itemsPerPage
        ? itemsPerPage
        : listPush.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>
          {' '}
          Mostrando {_count} de {listPush.length}
        </span>
      </div>
    );
  }

  
  const _cardHeader = () => (
    <Row className='justify-content-center'>
      <Col xl={12}>
        <Card className='bodyTable'>
          <CardHeader>
            <h2 className="d-flex align-items-center card-title mb-2 fw-bold">
              Anexar Archivo CSV
            </h2>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
              <div className="mb-3 mb-md-0">
                <img 
                  src="https://s3.amazonaws.com/app.kupi.s3/plantillas/muestra_push_masivo.PNG" 
                  alt="Imagen de muestra para push masivo" 
                  className="img-fluid"
                  style={{
                    width: 'auto',
                    height: 'auto'
                  }}>
                </img>
              </div>
              <div>
              <div 
                className="d-flex flex-column align-items-center mt-5">
                <Button 
                  color="info" 
                  className="mb-3"
                  tag="a" 
                  href="https://s3.amazonaws.com/app.kupi.s3/plantillas/plantilla_push_masivo.csv" 
                  download
                  >Descargar plantilla
                </Button>
              </div>
              <div className='divider mt-5' 
                style={{
                  borderTop: '1px solid #d3d3d3',
                  margin: '1rem 0',
                  opacity: '0.6',
                }}>
              </div>
              <div className="d-flex flex-column align-items-center mt-5">
                <p className="text-center m-4">El archivo debe estar en formato CSV (Excel separado por comas)</p>
                <Button 
                  color='primary'
                  onClick={() => toggleModal()}>Carga Push Masivamente</Button>
              </div>
            </div>
            </div>
          </CardHeader>
        </Card>
      </Col>
    </Row>
  );


  function _modalCargaMasiva() {
    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className='fw-bold'>Cargar archivo masivo
        </ModalHeader>
        <ModalBody className='p-4'>
          <Form className='row'>
            <FormGroup className='col-12'>
              <Label for="archivo">Seleccionar archivo CSV</Label>
              <div className='input input-file'>
                <div className='button'>
                  <Input
                    type='file'
                    onChange={(e) => handleFileChange(e, setFileCSV)}
                    value={fileCSV}
                    readOnly
                  >
                    Buscar
                  </Input>
                </div>
              </div>
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="imagen">Seleccionar Imagen</Label>
                <div className='input input-file'>
                  <div className='button'>
                    <Input
                      type='file'
                      onChange={(e) => handleFileChange(e, setFileImage)}
                      value={fileImage}
                      readOnly
                    >
                      Buscar
                    </Input>
                  </div>
                </div>
            </FormGroup>
            <FormGroup className='col-4'>
              <Label for="separator">Separador</Label>
              <div className='row'>
                <div className='col col-4'>
                  <label className={`radio ${separator === 'puntoycoma' ? 'state-error' : ''}`}>
                    <Input
                      type='radio'
                      name='separator'
                      value='puntoycoma'
                      checked={separator === 'puntoycoma'}
                      onChange={() => setSeparator('puntoycoma')}
                    >
                    </Input>
                    <i> ;</i>
                  </label>
                </div>
                <div className='col col-4'>
                  <label className={`radio ${separator === 'coma' ? 'state-error' : ''}`}>
                    <Input
                      type='radio'
                      name='separator'
                      value='coma'
                      checked={separator === 'coma'}
                      onChange={() => setSeparator('coma')}
                    ></Input>
                    <i> ,</i>
                  </label>
                </div>
              </div>
            </FormGroup>
            <FormGroup className='col-8'>
              <Label for="titMensaje">Título del mensaje</Label>
              <div className='input'>
                <Input
                  type='text'
                  name='titMensaje'
                  placeholder='Título'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                >
                </Input>
              </div>
            </FormGroup>
            <FormGroup className='col-12'>
              <Label for="emaUsuario">Mensaje</Label>
              <div className='input'>
                <Input
                  type='text'
                  name='desMensaje'
                  placeholder='Mensaje'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                >
                </Input>
              </div>
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
            Cerrar
          </Button>
          <Button 
            // onClick={createUserFinancier}
            color="primary"
          >
          Enviar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Imagen</th>
          <th>Usuario encargado</th>
          <th className='text-center'>Asignado</th>
          <th className='text-center'>No Asignado</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    const itemsToDisplay = filteredPush.length > 0 ? filteredPush : currentItems;

    return (
      <tbody className="list form-check-all">
        {itemsToDisplay.map((push, index) => {
          const uploadData = countPush[push.codUpload] || [];
          const estado0 = uploadData.find((item) => item.codEstadoUpload === 0);
          const estado1 = uploadData.find((item) => item.codEstadoUpload === 1);

          return (
            <tr key={index}> 
              <td>{ push?.codUpload}</td>
              <td>{ push?.fecUpload}</td>
              <td>
                { push?.urlImagen ? (
                  <img
                    src={push.urlImagen}
                    alt={`Imagen de ${push.codUpload}`}
                    style={{width: '50px', height: 'auto', objectFit: 'cover'}}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td>{ push?.nomUsuario } { push?.apeUsuario }</td>
              <td>
                {estado1 && (
                  <div className='d-flex justify-content-center'>
                    <Button
                      color="primary"
                      style={{
                        width: '50px'
                      }}
                      onClick={() => {
                        filterByEstado(push.codUpload, 1);
                        handleDetailsPush(push.codUpload, 1);
                        }}
                    >
                      {estado1.cant}
                    </Button>
                  </div>
                )}
              </td>
              <td>
                {estado0 && (
                  <div className='d-flex justify-content-center'>
                    <Button
                      color="primary"
                      style={{
                        width: '50px'
                      }}
                      onClick={() => {
                        filterByEstado(push.codUpload, 0);
                        handleDetailsPush(push.codUpload, 0);
                      }}
                    >
                      {estado0.cant}
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }


  const _tableListPush = () => {
    return (
      <div className='m-2'>
        <h5 className='table-title fw-bold mb-3'
          >Archivos subidos al sistema</h5>
        <table className="table align-middle table-nowrap" id="tokensTable">
          {_tableTittles()}
          {_tableBody()}
        </table>
      </div>
    );
  }


  return (
    <>
    <Container fluid>
      {_modalCargaMasiva()}
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title: "", message: "", type: "success", isVisible: false })}
      /> 
      {_cardHeader()}
      <Card className='bodyTable p-2'>

        {_tableListPush()}
        
        {listPush.length > 0 && (
          <div className="d-flex justify-content-between">
            {_itemCount()}
            <div className="pagination-wrap hstack gap-2">
              {renderPagination()}
            </div>
          </div>
        )}
      </Card>
    </Container>
    
    </>
  );
}