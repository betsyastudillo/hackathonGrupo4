import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
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
  getAdvertising,
  createAdvertising,
  updateAdvertising,
} from '../../slices/advertising/thunk';
import { getCitiesWithDeptoWS } from '@/slices/locations/thunk';

export const ListAdvertising = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const priceList = idCard => {
  //   console.log('Redirigiendo a lista de precios:', idCard);
  //   navigate(`/lista-precios-kupi-kards/${idCard}`);
  // };

  const _defaultAds = {
    codPromo: '',
    codTipo: '',
    descripcion: '',
    categoria: '',
    codCiudad: '',
    codEmpresa: '',
    urlLink: '',
    imgPromo: '',
    fecPublicaPromo: '',
    fecExpiraPromo: '',
    usrRegistra: '',
    numOrden: '',
  };

  const [selectedValue, setSelectedValue] = useState(0);
  const [cities, setCities] = useState([]);
  const { user } = useSelector(state => state.Login);
  const { advertising } = useSelector(state => state.Advertising);
  const [modalCreate, setModalCreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAds, setCurrentAds] = useState(_defaultAds);
  const [_searchingAdvertising, setSearchingAdvertising] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const toggleCreate = (card = null) => {
    // Si card es null o undefined, !!card será false e iremos a crear sino iremos a editar
    setIsEditMode(!!card);
    // Si card es null, utilizo _defaultGiftCard
    setCurrentAds(card || _defaultAds);
    setModalCreate(!modalCreate);
  };


  useEffect(() => {
    dispatch(getAdvertising());
  }, [dispatch]);


  useEffect(() => {
    getCities();
  }, []);


  const getCities = async () => {
    try {
      const { data } = await getCitiesWithDeptoWS();
      const citiesOptions = data.map(city => ({
        value: city.codCiudad,
        label: city.nomCiudad + ' (' + city.nomDepto + ')',
      }));
      setCities(citiesOptions);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };


  // Guardar nueva GiftCard o actualizar existente
  const createCard = async () => {
    try {
      const data = {
        codPromo: currentAds.codPromo,
        codTipo: +currentAds.codTipo,
        descripcion: currentAds.descripcion,
        categoria: +currentAds.categoria,
        codCiudad: +selectedValue,
        codEmpresa: +currentAds.codEmpresa,
        urlLink: currentAds.urlLink,
        imgPromo: currentAds.imgPromo,
        fecPublicaPromo: currentAds.fecPublicaPromo,
        fecExpiraPromo: currentAds.fecExpiraPromo,
        usrRegistra: user.codUsuario,
        numOrden: +currentAds.numOrden,
      };
      if (isEditMode) {
        //console.log('va en data edit', data);
        dispatch(updateAdvertising(data));
      } else {
        // console.log('va en create', data);
        dispatch(createAdvertising(data));
      }

      toggleCreate();
    } catch (err) {
      console.error('Error al guardar la tarjeta:', err);
    }
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    setCurrentAds({
      ...currentAds,
      [e.target.name]: e.target.value,
    });
  };


  // Maneja el selector de ciudades
  const handleSelectChange = e => {
    setSelectedValue(e.target.value);
  };


  
  const filteredAdvertising = advertising.filter((adver) => {
    // Convertimos los valores numéricos a las etiquetas de texto, se hace porque en tableBody está condicionado, y no permite filtrar por el texto que aparece en la tabla.
    const codTipoText = adver.codTipo === 0 ? 'Promoción' : 'Comercio Nuevo';
    const categoriaText = 
    adver.categoria === 0 ? 'Comercios' :
    adver.categoria === 1 ? 'Pines' :
    adver.categoria === 2 ? 'Recargas electrónicas' :
    'Seguros';
    
    return(
      (adver?.descripcion || '').toLowerCase().includes(_searchingAdvertising.toLowerCase()) ||  
      codTipoText.toLowerCase().includes(_searchingAdvertising.toLowerCase()) ||
      categoriaText.toLowerCase().includes(_searchingAdvertising.toLowerCase()) ||
      (adver?.urlLink || '').toLowerCase().includes(_searchingAdvertising.toLowerCase()) ||
      String(adver?.fecPublicaPromo || '').includes(_searchingAdvertising) ||
      String(adver?.fecExpiraPromo || '').includes(_searchingAdvertising) ||
      String(adver?.codEmpresa || '').includes(_searchingAdvertising)
    );
  });


  const totalPages = Math.ceil(filteredAdvertising.length / itemsPerPage);


  const currentItems = filteredAdvertising.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const onChangeData = (value) => {
    setSearchingAdvertising(value);
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
    const _count = (filteredAdvertising.length > itemsPerPage) ?  itemsPerPage : filteredAdvertising.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredAdvertising.length}</span>
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
          <th>Tipo</th>
          <th
            style={{
              width: '250px',
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Descripción
          </th>
          <th>Categoría</th>
          <th>Imágen</th>
          <th>Fecha Inicial</th>
          <th>Fecha Final</th>
          <th>Ciudad</th>
          <th>Empresa</th>
          <th>Orden</th>
          <th className="d-flex justify-content-center align-items-center">
            Acciones
          </th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems?.map(ad => (
          <tr key={ad.codPromo}>
            <td>{ad.codPromo}</td>
            <td>{ad.codTipo === 0 ? 'Promoción' : 'Comercio Nuevo'}</td>
            <td
              style={{
                width: '250px',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ad.descripcion}
            </td>
            <td>
              {ad.categoria === 0
                ? 'Comercios'
                : ad.categoria === 1
                ? 'Pines'
                : ad.categoria === 2
                ? 'Recargas electrónicas'
                : 'Seguros'}
            </td>
            <td>
              <img
                src={ad.imgPromo}
                alt="Promoción"
                style={{ width: '60px', height: 'auto' }}
              />
            </td>
            <td>{ad.fecPublicaPromo.slice(0, 10)}</td>
            <td>{ad.fecExpiraPromo.slice(0, 10)}</td>
            <td>{ad.codCiudad}</td>
            <td>{ad.codEmpresa}</td>
            <td>{ad.numOrden}</td>
            <td className="d-flex justify-content-center align-items-center">
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => toggleCreate(ad)}
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
      <Container fluid>
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
                  Lista de Publicidades en App
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
                        value={_searchingAdvertising}
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

                  {filteredAdvertising.length === 0 && (
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
                            No hemos encontrado publicidades que coincidan con tu búsqueda.
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {
                  filteredAdvertising.length > 0 && (
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
              size="xl"
              isOpen={modalCreate}
              toggle={toggleCreate}
              centered
            >
              <ModalHeader toggle={toggleCreate} className="fw-bold">
                {isEditMode ? 'Editar Publicidad' : 'Crear Publicidad'}
              </ModalHeader>
              <ModalBody className="p-4">
                <Form className="row">
                  <FormGroup className="col-4">
                    <Label for="codTipo">Tipo de Publicidad</Label>
                    <select
                      className="form-control"
                      name="codTipo"
                      id="codTipo"
                      value={currentAds.codTipo || '0'}
                      onChange={handleInputChange}
                    >
                      <option value="0">Promoción</option>
                      <option value="1">Comercio Nuevo</option>
                    </select>
                  </FormGroup>
                  <FormGroup className="col-8">
                    <Label for="descripcion">Descripción</Label>
                    <Input
                      type="text"
                      name="descripcion"
                      id="descripcion"
                      placeholder="Agrega una descripción"
                      value={currentAds.descripcion}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="categoria">Categoría</Label>
                    <select
                      className="form-control"
                      name="categoria"
                      id="categoria"
                      value={currentAds.categoria || '0'}
                      onChange={handleInputChange}
                    >
                      <option value="0">Comercios</option>
                      <option value="1">Pines</option>
                      <option value="2">Recargas Eléctronicas</option>
                      <option value="3">Seguros</option>
                    </select>
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="codCiudad">Ciudad</Label>
                    <Input
                      type="select"
                      id="codCiudad"
                      value={selectedValue}
                      onChange={handleSelectChange}
                    >
                      <option value="0" disabled>
                        Seleccione uno...
                      </option>
                      {cities?.map(city => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="codEmpresa">Empresa</Label>
                    <Input
                      type="text"
                      name="codEmpresa"
                      id="codEmpresa"
                      placeholder="Agrega una empresa"
                      value={currentAds.codEmpresa}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-6">
                    <Label for="urlLink">URL Link</Label>
                    <Input
                      type="text"
                      name="urlLink"
                      id="urlLink"
                      placeholder="Agrega una empresa"
                      value={currentAds.urlLink}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-6">
                    <Label for="imgPromo">Banner Publicitario</Label>
                    <Input
                      type="text"
                      name="imgPromo"
                      id="imgPromo"
                      placeholder="Agrega una empresa"
                      value={currentAds.imgPromo}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="fecPublicaPromo">Fecha de Inicio</Label>
                    <Input
                      type="date"
                      name="fecPublicaPromo"
                      id="fecPublicaPromo"
                      value={
                        currentAds.fecPublicaPromo
                          ? currentAds.fecPublicaPromo.slice(0, 10)
                          : ''
                      }
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="fecExpiraPromo">Fecha de Fin</Label>
                    <Input
                      type="date"
                      name="fecExpiraPromo"
                      id="fecExpiraPromo"
                      value={
                        currentAds.fecExpiraPromo
                          ? currentAds.fecExpiraPromo.slice(0, 10)
                          : ''
                      }
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-4">
                    <Label for="numOrden">Orden</Label>
                    <Input
                      type="number"
                      name="numOrden"
                      id="numOrden"
                      placeholder="Agrega un orden"
                      value={currentAds.numOrden}
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
    </>
  );
};
