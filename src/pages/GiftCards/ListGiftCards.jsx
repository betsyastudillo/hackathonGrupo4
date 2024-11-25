import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
// Iconos
import KUPIICONS from '@/common/icons/icons';
import { getGiftCards,
  // createGiftCard,
  updateGiftCard } from '@/slices/payments/giftCards/thunk';

export const ListGiftCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const priceList = codGrupo => {
    console.log('Redirigiendo a lista de precios:', codGrupo);
    navigate(`/lista-precios-gift-cards/${codGrupo}`);
  };

  const _defaultGiftCard = {
    codGrupo: '',
    nomPin: '',
    desPin: '',
    urlImagen: '',
    bgColor: '',
    numOrden: '',
  };

  // const { user } = useSelector(state => state.Login);
  const { giftCards } = useSelector(state => state.GiftCards);
  const [modalCreate, setModalCreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(_defaultGiftCard);
  const [ _searchingGiftCard, setSearchingGiftCard ] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;


  const toggleCreate = (card = null) => {
    // Si card es null o undefined, !!card será false e iremos a crear sino iremos a editar
    setIsEditMode(!!card);
    // Si card es null, utilizo _defaultGiftCard
    setCurrentCard(card || _defaultGiftCard);
    setModalCreate(!modalCreate);
  };


  useEffect(() => {
    dispatch(getGiftCards());
  }, [dispatch]);


  // Guardar nueva GiftCard o actualizar existente
  const createCard = async () => {
    try {
      const data = {
        codGrupo: currentCard.codGrupo,
        nomPin: currentCard.nomPin,
        desPin: currentCard.desPin,
        bgColor: currentCard.bgColor,
        urlImagen: currentCard.urlImagen,
        numOrden: currentCard.numOrden,
      };
      if (isEditMode) {
        console.log('va en data edit', data);
        dispatch(updateGiftCard(data));
      } else {
        console.log('va en create', data);
        // dispatch(createGiftCard(data));
      }

      toggleCreate();
    } catch (err) {
      console.error('Error al guardar la tarjeta:', err);
    }
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = e => {
    setCurrentCard({
      ...currentCard,
      [e.target.name]: e.target.value,
    });
  };


  const filteredReport = giftCards.filter((giftCard) => 
    (giftCard?.nomPin || '').toLowerCase().includes(_searchingGiftCard.toLowerCase()) || 
    (giftCard?.desPin || '').toLowerCase().includes(_searchingGiftCard.toLowerCase()) ||
    (giftCard?.urlImagen || '').toLowerCase().includes(_searchingGiftCard.toLowerCase()) || 
    String(giftCard?.fechaCreacion || '').includes(_searchingGiftCard)
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
    setSearchingGiftCard(value);
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


  function _tableTitles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }}>
            ID
          </th>
          <th>Tarjeta</th>
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
          <th>Imágen</th>
          <th>Color</th>
          <th>Categoría</th>
          <th>Orden</th>
          <th>Precios</th>
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
        {currentItems?.map((card, index) => (
          <tr key={index}>
            <td>{card.codGrupo}</td>
            <td>{card.nomPin}</td>
            <td
              style={{
                width: '250px',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.desPin}
            </td>
            <td>{card.urlImagen}</td>
            <td>{card.bgColor}</td>
            <td>{card.nomCategoria}</td>
            <td>{card.numOrden}</td>
            <td>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => priceList(card.codGrupo)}
              >
                <KUPIICONS.ListMenu height="18" width="18" />
              </Button>
            </td>
            <td className="d-flex justify-content-center align-items-center">
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => toggleCreate(card)}
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
                <h4 className="card-title mb-0">Listado de GiftCards</h4>
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
                        value={_searchingGiftCard}
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

                  {filteredReport.length === 0 && (
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
                            No hemos encontrado submenús pertenecientes al menú
                            principal.
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {
                  filteredReport.length > 0 && (
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
                {isEditMode ? 'Editar GiftCard' : 'Crear GiftCard'}
              </ModalHeader>
              <ModalBody className="p-4">
                <Form className="row">
                  <FormGroup className="col-12">
                    <Label for="nomPin">Nombre del Pin</Label>
                    <Input
                      type="text"
                      name="nomPin"
                      id="nomPin"
                      placeholder="Agrega el nombre del Pin"
                      value={currentCard.nomPin}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-12">
                    <Label for="desPin">Descripción</Label>
                    <Input
                      type="text"
                      name="desPin"
                      id="desPin"
                      placeholder="Agrega una descripción"
                      value={currentCard.desPin}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-3">
                    <Label for="bgColor">Color Tarjeta</Label>
                    <Input
                      type="text"
                      name="bgColor"
                      id="bgColor"
                      placeholder="Agrega un color"
                      value={currentCard.bgColor}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-9">
                    <Label for="urlImagen">Imágen</Label>
                    <Input
                      type="text"
                      name="urlImagen"
                      id="urlImagen"
                      placeholder="Agrega un fondo"
                      value={currentCard.urlImagen}
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
                      value={currentCard.numOrden}
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
                    borderColor: '#DDF580',
                    color: '#000'
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
