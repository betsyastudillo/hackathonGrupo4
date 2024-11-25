import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,} from 'reactstrap';
// Iconos
import KUPIICONS from '@/common/icons/icons';
import { getGiftCardsKupi, createGiftCardKupi, updateGiftCardKupi } from '../../slices/payments/giftCards/thunk';

// Componentes
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import SearchableSelect from '@/Components/Common/select/searchableSelect';
// Utilidades
import { defaultGiftCardKupi, formatBool,  formatDate, toastDefault } from '../../utilities';

export const ListGiftCardsKupi = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const priceList = idCard => { navigate(`/lista-precios-kupi-kards/${idCard}`) };


  const { user } = useSelector(state => state.Login);
  const { giftCardsKupi } = useSelector(state => state.GiftCards);
  const [modalCreate, setModalCreate] = useState(false);
  const [isEditMode, setIsEditMode]   = useState(false);
  const [currentCard, setCurrentCard] = useState(defaultGiftCardKupi);
  const [_searchingGiftCardKupi, setSearchingGiftCardKupi] = useState('');
  const [showToast, setShowToast] = useState(toastDefault);

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  const formatBoolCodEstadoOptions = [
    { value: 0, label: "Inhabilitado" },
    { value: 1, label: "Habilitado" }
  ];

  const toggleCreate = (card = null) => {
    setIsEditMode(!!card);
    setCurrentCard(card || defaultGiftCardKupi);
    setModalCreate(!modalCreate);
  };

  useEffect(() => {
    dispatch(getGiftCardsKupi());
  }, [dispatch]);

  // Guardar nueva GiftCard o actualizar existente
  const createCard = async () => {
    try {
      const data = {
        id: currentCard.id,
        nomTarjeta: currentCard.nomTarjeta,
        descripcion: currentCard.descripcion,
        bgColor: currentCard.bgColor,
        background: currentCard.background,
        claseBono: +currentCard.claseBono || 13,
        usrCreacion: user.codUsuario,
        orden: currentCard.orden,
        codEstado: +currentCard.codEstado
      };
      if (isEditMode) {
        // console.log('va en data edit', data);
        const toast = await dispatch(updateGiftCardKupi(data));
        if (toast){ 
          setShowToast({ title  : "Proceso exitoso",  message: "Los cambios se han realizado exitosamente.", type   : "success",  isVisible: true })
        }
      } else {
        // console.log('va en create', data);
        dispatch(createGiftCardKupi(data));
      }

      toggleCreate();
    } catch (err) {
      console.error('Error al guardar la tarjeta:', err);
    }
  };

  // Maneja el cambio en los inputs del modal
  // const handleInputChange = e => {
  //   setCurrentCard({
  //     ...currentCard,
  //     [e.target.name]: e.target.value,
  //   });
  //   console.log('valores actuales', currentCard);
  // };
  const handleInputChange = e => {
    const { name, value } = e.target;
    setCurrentCard({
      ...currentCard,
      [name]: name === 'codEstado' ? Number(value) : value,
    });
  };

  const handleInputSelectedChange = e => {
    console.log(e)
    setCurrentCard({
      ...currentCard,
      codEstado: e,
    });
  }
  const filteredReport = giftCardsKupi.filter(
    giftCardsKupi =>
      (giftCardsKupi?.nomTarjeta || '')
        .toLowerCase()
        .includes(_searchingGiftCardKupi.toLowerCase()) 
      ||
      (giftCardsKupi?.descripcion || '')
        .toLowerCase()
        .includes(_searchingGiftCardKupi.toLowerCase()) 
      ||
      giftCardsKupi?.categorias?.some(categoria =>
        (categoria.nomCategoria || '')
          .toLowerCase()
          .includes(_searchingGiftCardKupi.toLowerCase())
      ) 
      ||
      String(giftCardsKupi?.fechaCreacion || '').includes(
        _searchingGiftCardKupi
      )
  );

  const currentItems = filteredReport.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const onChangeData = value => {
    setSearchingGiftCardKupi(value);
  };
  

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
          <th>Categorías</th>
          <th>Fecha Creación</th>
          <th>Orden</th>
          <th>Habilitada</th>

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
        {currentItems?.map(card => (
          <tr key={card.id}>
            <td>{card.id}</td>
            <td>{card.nomTarjeta}</td>
            <td
              style={{
                width: '250px',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.descripcion}
            </td>
            <td>{card.categorias[0].nomCategoria}</td>
            <td>{ formatDate(card.fechaCreacion) } </td>
            <td className='text-end'>{card.orden}</td>
            <td>{ formatBool(card.codEstado) }</td>

            <td>
              <Button
                color="light rounded-pill p-2"
                className="gap-2 d-flex justify-content-center"
                onClick={() => priceList(card.id)}
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
      <ToastKupi
        title = {showToast.title}    message= {showToast.message}
        type  = {showToast.type}     isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title  : "",  message: "", type   : "success",  isVisible: false })} // Cerrar el toast
      />

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
                <h4 className="card-title mb-0">Listado de Gift Cards Kupi</h4>
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
                        value={_searchingGiftCardKupi}
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
                          No hemos encontrado Gift Cards de Kupi que coincidan
                          con tu búsqueda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                { filteredReport.length > 0 &&
                  <PaginationBar
                    totalItems={ filteredReport.length }
                    itemsPerPage={pageSize}
                    currentPage={pageIndex + 1}
                    onPageChange={(page) => {
                      setPageIndex(page - 1);
                    }}
                  />
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
                {isEditMode ? 'Editar GiftCard' : 'Crear GiftCard'}
              </ModalHeader>
              <ModalBody className="p-4">
                <Form className="row">
                  <FormGroup className="col-12">
                    <Label for="nomTarjeta">Nombre de la tarjeta</Label>
                    <Input
                      type="text"
                      name="nomTarjeta"
                      id="nomTarjeta"
                      placeholder="Agrega el nombre de la tarjeta"
                      value={currentCard.nomTarjeta}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-12">
                    <Label for="descripcion">Descripción</Label>
                    <textarea
                      name="descripcion"
                      id="descripcion"
                      placeholder="Agrega una descripción"
                      value={currentCard.descripcion}
                      className="form-control"
                      onChange={handleInputChange}
                      style={{ height: '100px' }}
                    />
                  </FormGroup>
                  <FormGroup className="col-lg-3 col-md-3 col-sm-6 col-12">
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
                  <FormGroup className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <Label for="background">Fondo</Label>
                    <Input
                      type="text"
                      name="background"
                      id="background"
                      placeholder="Agrega un fondo"
                      value={currentCard.background}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <Label for="claseBono">Clase Bono</Label>
                    <Input
                      type="text"
                      name="claseBono"
                      id="claseBono"
                      placeholder="Agrega una clase"
                      value={currentCard.claseBono}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <Label for="orden">Orden</Label>
                    <Input
                      type="number"
                      name="orden"
                      id="orden"
                      placeholder="Agrega un orden"
                      value={currentCard.orden}
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
                  <FormGroup className="col-lg-4 col-md-4 col-sm-6 col-12">
                    <SearchableSelect
                      title="Estado"
                      options={formatBoolCodEstadoOptions}
                      placeholder="Selecciona un menú..."
                      onChange={ handleInputSelectedChange }
                      selectedValue={ currentCard.codEstado }
                      marginTop = {0}
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
                    color: '#000',
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
