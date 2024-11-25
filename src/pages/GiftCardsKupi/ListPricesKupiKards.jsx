import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Container, Row, Col,  Card, CardHeader, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, } from 'reactstrap';
// Iconos
import KUPIICONS from '@/common/icons/icons';
import { getListPricesKupiKards, createPriceKupiKard, updatePriceKupiKard, } from '../../slices/payments/giftCards/thunk';
// Utilidades
import { formatSaldoCOP } from '../../utilities';

export const ListPricesKupiKards = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { idCard } = useParams();

  const _defaultGiftCard = {
    id: '',
    valor: '',
  };

  // const { user } = useSelector(state => state.Login);
  const { listPricesKupiKards } = useSelector(state => state.GiftCards);
  const [modalCreate, setModalCreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(_defaultGiftCard);

  const toggleCreate = (card = null) => {
    // Si card es null o undefined, !!card será false e iremos a crear sino iremos a editar
    setIsEditMode(!!card);
    // Si card es null, utilizo _defaultGiftCard
    setCurrentCard(card || _defaultGiftCard);
    setModalCreate(!modalCreate);
  };

  useEffect(() => {
    dispatch(getListPricesKupiKards(idCard));
  }, []);

  // Guardar un nuevo precio o actualizar existente
  const priceCard = async () => {
    try {
      const data = {
        id: currentCard.id,
        codGiftCardKupi: parseInt(idCard),
        valor: parseInt(currentCard.valor),
      };
      console.log('va al ws', data);
      if (isEditMode) {
        // console.log('va en data edit', data);
        dispatch(updatePriceKupiKard(data));
      } else {
        // console.log('va en create', data);
        dispatch(createPriceKupiKard(data));
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

  function _tableTitles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: '50px' }}>
            ID
          </th>
          <th>Tarjeta</th>
          <th>Color</th>
          <th>Fondo</th>
          <th>Precio</th>
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
        {listPricesKupiKards?.map(card => (
          <tr key={card.id}>
            <td>{card.id}</td>
            <td>{card.nomTarjeta}</td>
            <td>{card.bgColor}</td>
            <td> { card.background }</td>
            <td> { formatSaldoCOP( card.valor ) }</td>
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
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle=" KupiKards" />
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
                  <h4 className="card-title mb-0">Listado de Precios</h4>
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
                          // value={_searchingProfiles}
                          // onChange={e => onChangeData(e.target.value)}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.Search height="20" width="20" />
                        </span>
                        <span
                          className="mdi mdi-close-circle search-widget-icon search-widget-icon-close position-absolute"
                          id="search-close-options"
                          // onClick={() => onChangeData('')}
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

                    {listPricesKupiKards?.length === 0 && (
                      <div className="noresult mb-5">
                        <div className="text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: '75px', height: '75px' }}
                          />
                          <h5 className="mt-5">
                            ¡Lo sentimos! No se encontraron resultados
                          </h5>
                          <p className="text-muted mb-0">
                            No hemos encontrado lista de precios para esta Kupi
                            Kard.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {
                    // Filtered Users
                    // filteredProfiles.length > 0 && (
                    //   <div className="d-flex justify-content-between">
                    //     {_itemCount()}
                    //     <div className="pagination-wrap hstack gap-2">
                    //       {renderPagination()}
                    //     </div>
                    //   </div>
                    // )
                  }
                </CardBody>
              </Card>

              {/* Modal Create - Edit */}
              <Modal isOpen={modalCreate} toggle={toggleCreate} centered>
                <ModalHeader toggle={toggleCreate} className="fw-bold">
                  {isEditMode
                    ? 'Editar GiftCard'
                    : 'Agregar precio a Kupi Kard'}
                </ModalHeader>
                <ModalBody className="p-4">
                  <Form className="row">
                    <FormGroup className="col-12">
                      <Label for="valor">Valor</Label>
                      <Input
                        type="number"
                        name="valor"
                        id="valor"
                        placeholder="Agrega un valor"
                        value={currentCard.valor}
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
                    onClick={priceCard}
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
      </div>
    </>
  );
};
