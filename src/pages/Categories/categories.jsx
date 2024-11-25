import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, ModalFooter, FormGroup, Label, Modal, ModalHeader, ModalBody, Form } from 'reactstrap';
// Components
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../utilities';

// Iconos
import KUPIICONS      from '@/common/icons/icons';
// estilos
import './style/index.scss';
import { getCategoriesWS, updateCategoryWS, createCategoryWS } from '../../slices/categories/thunk';


export const _categoriesView = () => {

  const categorieDefault = {
    idCategoria: '',
    nomCategoria: '',
    icono: '',
    destacado: 0,
    subCategorias: 0,
    codEstado: 0
  }

  const [ categories, setCategories ] = useState([]);
  const [ currentCategory, setCurrentCategory ] = useState(categorieDefault)
  const [ _searchingCategory, setSearchingCategory ] = useState("");
  const [ showToast, setShowToast ] = useState(toastDefault);

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  const [ isModalOpen, setIsModalOpen ] = useState(false); 
  const [ isEditMode, setIsEditMode ] = useState(false); 


  useEffect(() => {
    fetchCategories()
  }, []);


  const fetchCategories = async () => {
    try {

      const { data } = await getCategoriesWS()

      setCategories(data);

    } catch (error) {
      
      console.error('Error fetching information:', error);
    }
  }
  

  const saveCategory = async () => {

    setShowToast({
      title  : "Procesando...",  
      message: "Por favor espere",
      type   : "",  
      isVisible: true
    });
    
    try {
      
      if(isEditMode) {

        const data = {
          params: currentCategory.idCategoria,
          bodyOptions: {
            nomCategoria: currentCategory.nomCategoria,
            icono: currentCategory.icono || "",
            destacado: currentCategory.destacado || 0,
            subCategorias: currentCategory.subCategorias || 0,
            codEstado: currentCategory.codEstado || 1,
          }
        }

        await updateCategoryWS(data)

        
        setShowToast({
          title: "Actualizado exitosamente",
          message: "La categoría ha sido actualizado.",
          type: "success",
          isVisible: true
        });
        
        toggleModal()
        fetchCategories()

      } else {
        const data = {
          bodyOptions: {
            nomCategoria: currentCategory.nomCategoria,
            icono: currentCategory.icono || "",
            destacado: currentCategory.destacado || 0,
            subCategorias: currentCategory.subCategorias || 0,
            codEstado: currentCategory.codEstado || 1,
          }
        }

        await createCategoryWS(data)

        setShowToast({
          title: "Creado exitosamente",
          message: "La categoría ha sido creada.",
          type: "success",
          isVisible: true
        });
      }

      toggleModal();

      setTimeout(() => {
        window.location.reload();
      }, 2000); 

    } catch (error) {
      console.error('Error fetching information:', error);
    } 
  }

  // constantes internas
  const toggleModal = (category = null) => {
    setIsEditMode(!!category)
    setCurrentCategory(category || categorieDefault);
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };


  const filteredReport = categories.filter((category) => 
    category?.nomCategoria.toLowerCase().includes(_searchingCategory.toLowerCase()) || 
    category?.icono.toLowerCase().includes(_searchingCategory.toLowerCase())  
  );
  

  const totalPages = Math.ceil(filteredReport.length / pageSize)

  
  const currentItems = filteredReport.slice(
    pageIndex * pageSize, 
    (pageIndex + 1) * pageSize
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setPageIndex(page -1)
    }
  }
  

  const onChangeData = (value) => {
    setSearchingCategory(value);
    setPageIndex(0);
  }
  
  
  function renderPagination() {
    let pages = [];

    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev" className={`page-item pagination-prev ${pageIndex === 0 ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(pageIndex)}
      >
        Previo
      </Link>
    );

    // Mostrar la primera página siempre
    pages.push(
      <Link
        key="1"   className={`page-item ${pageIndex === 0 ? 'active' : ''}`}
        to="#"    onClick={() => handlePageChange(1)}
      >
        1
      </Link>
    );  

    // Si la página actual es mayor que 3, mostrar puntos suspensivos antes
    if (pageIndex > 2) {
      pages.push(<span key="dots-prev" className="dots">..</span>);
    } 

    // Mostrar la página actual, o las dos páginas adyacentes
    for (let i = Math.max(2, pageIndex); i <= Math.min(totalPages - 1, pageIndex + 2); i++) {
      pages.push(
        <Link
          key={i}  className={`page-item ${pageIndex === i - 1 ? 'active' : ''}`}
          to="#"   onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      );
    }

    // Si la página actual es más de 2 antes de la última, mostrar puntos suspensivos después
    if (pageIndex < totalPages - 3) {
      pages.push(<span key="dots-next" className="dots">..</span>);
    }

    // Mostrar la última página siempre
    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}  className={`page-item ${pageIndex === totalPages - 1 ? 'active' : ''}`}
          to="#"  onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }

    // Agregar botón de "Siguiente"
    pages.push(
      <Link
        key="next" className={`page-item pagination-next ${pageIndex === totalPages - 1 ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(pageIndex + 2)}
      >
        Siguiente
      </Link>
    );
  
    return pages;
  }


  function _itemCount(){
    const _count = (filteredReport.length > pageSize) ?  pageSize : filteredReport.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredReport.length}</span>
      </div>
    );
  }


  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: "50px" }}> ID </th>
          <th> Nombre    </th>
          <th> Icono     </th>
          <th scope="col" style={{ width: "50px" }}> Destacado    </th>
          <th scope="col" style={{ width: "50px" }}> Subcategoria </th>
          <th scope="col" style={{ width: "50px" }}> Estado       </th>
          <th className='d-flex justify-content-center'>Acciones</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {}
        {currentItems.map((category, index) => (
          <tr key={index}>
            <td>{ category?.idCategoria}</td>
            <td>{ category?.nomCategoria}</td>
            <td>{ category?.icono}</td>
            <td>{ category?.destacado }</td>
            <td>{ category?.subCategorias}</td>
            <td>{ category?.codEstado}</td>
            <td>
              <div 
                className="gap-2 d-flex justify-content-center"           
                onClick={() => toggleModal(category)}
              >
                <KUPIICONS.Pencil/>
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
          {isEditMode ? 'Editar Categoría' : 'Agregar Categoría'}
        </ModalHeader>
        <ModalBody className='p-4'>
          <Form className='row'>
            <FormGroup className='col-12'>
              <Label for="nomCategoria">Nombre</Label>
              <Input
                type="text"
                name="nomCategoria"
                id="nomCategoria"
                placeholder='Agregar Nombre'
                value={currentCategory.nomCategoria}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="icono">Icono</Label>
              <Input
                type="text"
                name="icono"
                id="icono"
                placeholder='Agregar nombre del ícono'
                value={currentCategory.icono}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="destacado">Destacado</Label>
              <Input
                type="text"
                name="destacado"
                id="destacado"
                placeholder='Agregar destacado (1/0)'
                value={currentCategory.destacado}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="subCategorias">Subcategoria</Label>
              <Input
                type="text"
                name="subCategorias"
                placeholder='Agregar Subcategoría (1/0)'
                id="subCategorias"
                value={currentCategory.subCategorias}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="codEstado">Estado</Label>
              <Input
                type="number"
                name="codEstado"
                id="codEstado"
                placeholder='Agregar estado (1 visible / 0 invisible)'
                value={currentCategory.codEstado}
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
          onClick={saveCategory}
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
        onClose={() => setShowToast(toastDefault)}
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

        <Row className='g-0 align-items-center'>
          <Col xl={12}>
            <Card className="bodyTable">
              <CardHeader>
                <h4 className='card-title mb-0'>Lista de Categorías</h4>
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
                        value={_searchingCategory}
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
              <div className='table-responsive table-card mt-3 mb-1'>
                <table className="table align-middle table-nowrap">
                  {_tableTittles()}
                  {_tableBody()}
                </table>
                {filteredReport.length === 0 && (
                  <div className="noresult">
                    <div className="text-center">
                      <lord-icon
                        src="https://cdn.lordicon.com/msoeawqm.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "75px", height: "75px" }}
                      />
                      <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                      <p className="text-muted mb-0">No hemos encontrado categorías que coincidan con tu búsqueda.</p>
                    </div>
                  </div>
                )}
              </div>
              { filteredReport.length > 0 && (
                <div className="d-flex justify-content-between">
                    {_itemCount()}
                    <div className="pagination-wrap hstack gap-2">
                      {renderPagination()}
                    </div>
                  </div>
              )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

    </>
  );
}