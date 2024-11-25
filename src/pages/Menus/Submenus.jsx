import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubmenusWS, createSubmenuWS, updateSubmenuWS } from '../../slices/menus/thunk';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, ModalFooter, FormGroup, Label, Modal, ModalHeader, ModalBody, Form } from 'reactstrap';

// Iconos
import KUPIICONS      from '@/common/icons/icons';
//Estilo
import '@/pages/Menus/styles/index.scss';

export const _SubMenusView = () => {

  // Obtenemos de los parámetros el codMenuPrincipal
  const { codMenuPrincipal } = useParams();

  const _defaultCurrentSubmenu = {
    id: '',
    nomSubmenu: '',
    ordItem: '',
    urlReact: '',
    codMenuPrincipal: codMenuPrincipal,
    visible: 1
  }

  // Use States
  const [_submenusKupi, setSubmenusKupi]    = useState([]);
  const [currentSubmenu, setCurrentSubmenu] = useState(_defaultCurrentSubmenu);
  const [_searchingSubmenu, setSearchingSubmenu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditMode, setIsEditMode]   = useState(false); 

  // Use effects
  useEffect(() => {
    if (codMenuPrincipal){
      console.log("Llamando a getSubmenus con:", codMenuPrincipal);
      getSubmenus(codMenuPrincipal);
    }
  }, [codMenuPrincipal]);

  // Web Services or Calling to Api
  const getSubmenus = async (codMenuPrincipal) => {
    try {      
      console.log("Obteniendo submenús con codMenuPrincipal:", codMenuPrincipal)
      const { data } = await getSubmenusWS({ params: codMenuPrincipal, bodyOptions: [] });

      setSubmenusKupi(data);
    } catch (err) {
      console.error('Error fetching submenus:', err);
    }
  }

  // Guardar nuevo menú o actualizar existente
  const saveSubmenu = async () => {
    try {
      if (isEditMode) {
        // Editar menú existente
        const data = {
          params: currentSubmenu.idSubmenu,
          bodyOptions: {
            nomSubmenu  : currentSubmenu.nomSubmenu,
            urlReact : currentSubmenu.urlReact  || "",
            codMenuPrincipal: currentSubmenu.codMenuPrincipal || "0",
            visible: currentSubmenu.visible || "1",
            ordItem  : isFinite(+currentSubmenu.ordItem) ? +currentSubmenu.ordItem : 0,
          }
        }

        await updateSubmenuWS(data);

      } else {
        console.log("Agregar", currentSubmenu)
        const data = {
          bodyOptions: {
            nomSubmenu  : currentSubmenu.nomSubmenu,
            urlReact : currentSubmenu.urlReact  || "/dashboard",
            codMenuPrincipal: currentSubmenu.codMenuPrincipal || "0",
            visible: currentSubmenu.visible || "",
            ordItem  : isFinite(+currentSubmenu.ordItem) ? +currentSubmenu.ordItem : 0,
          }
        }
        // Agregar nuevo menú
        const response = await createSubmenuWS(data);
        console.log("La respuesta del WS en agregar es:", response);
      }
      getSubmenus(codMenuPrincipal); // Refrescar la lista de menús
      toggleModal(); // Cerrar el modal
    } catch (err) {
      console.error('Error saving submenu:', err);
    }
  };

  // Funciones del App
  const toggleModal = (submenu = null) => {
    // Comprobar null, undefined, 0, false, NaN
    setIsEditMode(!!submenu);
    // Set el current submenu para trabajar en el modal
    setCurrentSubmenu(submenu || _defaultCurrentSubmenu);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = (e) => {
    const {name, value} = e.target;

    // Nos aseguramos que el campo urlReact siempre vaya con "/"
    let newValue = value;

    if( name === 'urlReact' && !newValue.startsWith("/")) {
      newValue = '/' + newValue;
    }

    // Actualiza el estado del Submenú
    setCurrentSubmenu({
      ...currentSubmenu,
      [name]: newValue
    });

  };

  // Filtrar usuarios según búsqueda
  const filteredSubmenus = _submenusKupi.filter((submenu) =>
    submenu?.nomSubmenu.toLowerCase().includes(_searchingSubmenu.toLowerCase()) ||  
    submenu?.urlReact.toLowerCase().includes(_searchingSubmenu.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubmenus.length / itemsPerPage);

  const currentItems = filteredSubmenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeData = (value) => {
    setSearchingSubmenu(value);
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
    const _count = (filteredSubmenus.length > itemsPerPage) ?  itemsPerPage : filteredSubmenus.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredSubmenus.length}</span>
      </div>
    );
  }
  
  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          {/* <th scope="col" style={{ width: "50px" }}>ID</th> */}
          <th>Nombre</th>
          <th>Url</th>
          <th>Orden</th>
          <th className='d-flex justify-content-center'>Acciones</th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((submenu) => (
          <tr key={submenu.idSubmenu}>
            {/* <td>{submenu.idSubmenu}</td> */}
            <td>{submenu.nomSubmenu}</td>
            <td>{submenu?.urlReact ? submenu.urlReact : 'Sin Url asignada'}</td>
            <td className='py-3'>{submenu?.ordItem ? submenu.ordItem : '0'}</td>
            <td>
              <div
                className='gap-2 d-flex justify-content-center'
                onClick={() => toggleModal(submenu)}
                >
                <KUPIICONS.Pencil height="18" width="18" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  function _modalOptions() {

    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
              <ModalHeader toggle={toggleModal} className='fw-bold'>
                {isEditMode ? 'Editar Submenú' : 'Agregar Submenú'}
              </ModalHeader>
              <ModalBody className='p-4'>
                <Form className='row'>
                  <FormGroup className='col-12'>
                    <Label for="nomSubmenu">Nombre</Label>
                    <Input
                      type="text"
                      name="nomSubmenu"
                      id="nomSubmenu"
                      placeholder='Agregar Nombre'
                      value={currentSubmenu.nomSubmenu}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className='col-6'>
                    <Label for="urlReact">URL</Label>
                    <Input
                      type="text"
                      name="urlReact"
                      id="urlReact"
                      placeholder='Agregar URL'
                      value={currentSubmenu.urlReact}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className='col-6'>
                    <Label for="ordItem">Orden</Label>
                    <Input
                      type="number"
                      name="ordItem"
                      id="ordItem"
                      placeholder='Agregar Orden (opcional)'
                      value={currentSubmenu.ordItem}
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
                  onClick={saveSubmenu}
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
                <h4 className="card-title mb-0">Lista de Submenús</h4>
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
                        value={_searchingSubmenu}
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

                  {_submenusKupi.length === 0 && (
                    <div className="noresult">
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        />
                        <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                        <p className="text-muted mb-0">No hemos encontrado submenús pertenecientes al menú principal que coincidan con tu búsqueda.</p>
                      </div>
                    </div>
                  )}
                </div>

                { // Filtered Users
                  filteredSubmenus.length > 0 && (
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