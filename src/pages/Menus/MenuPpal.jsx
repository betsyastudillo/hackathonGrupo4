import { useEffect, useState } from 'react';
import { getMenusPpalWS, updateMenusPpalWS, createMenusPpalWS } from '../../slices/menus/thunk';
import { Card, CardBody, CardHeader, CardImg, Col, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

// Iconos
import KUPIICONS      from '@/common/icons/icons';
import { MENUSICONS } from '@/assets/images';
//Estilo
import '@/pages/Menus/styles/index.scss';
import { useNavigate } from 'react-router-dom';

export const MenuPpal = () => {

  // Hook para redirigir a submenús
  const navigate = useNavigate();

  const handleSubmenuRedirect = (codMenuPrincipal) => {
    
    navigate(`/submenu/${codMenuPrincipal}`);
  };

  const _defaultCurretMenu = {
    id: '',
    nomMenu: '',
    urlReact: '',
    iconoMenu: '',
    colorMenu: '',
    ordItem: ''
  }
  // Use States
  const [_menusKupi, setMenusKupi]    = useState([]);
  const [currentMenu, setCurrentMenu] = useState(_defaultCurretMenu);
  // State para modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditMode, setIsEditMode]   = useState(false); 

  // Use effects
  useEffect(() => {
    getMenusPpal();
  }, []);

  // Web Services or Calling to Api
  const getMenusPpal = async () => {
    try {      

      const { data } = await getMenusPpalWS();

      setMenusKupi(data);

    } catch (err) {
      console.error('Error fetching menusPpal:', err);
    }
  }

  // Guardar nuevo menú o actualizar existente
  const saveMenu = async () => {
    try {
      if (isEditMode) {
        // Editar menú existente

        const data = {
          params: currentMenu.id,
          bodyOptions: {
            nomMenu  : currentMenu.nomMenu,
            urlReact : currentMenu.urlReact  || "",
            iconoMenu: currentMenu.iconoMenu || "inicio",
            colorMenu: currentMenu.colorMenu || "",
            ordItem  : isFinite(+currentMenu.ordItem) ? +currentMenu.ordItem : 0,
          }
        }

        await updateMenusPpalWS(data);

      } else {

        const data = {
          bodyOptions: {
            nomMenu  : currentMenu.nomMenu,
            urlReact : currentMenu.urlReact  || "",
            iconoMenu: currentMenu.iconoMenu || "inicio",
            colorMenu: currentMenu.colorMenu || "",
            ordItem  : isFinite(+currentMenu.ordItem) ? +currentMenu.ordItem : 0,
          }
        }
        // Agregar nuevo menú
        await createMenusPpalWS(data);
        
      }
      getMenusPpal(); // Refrescar la lista de menús
      toggleModal(); // Cerrar el modal
    } catch (err) {
      console.error('Error saving menu:', err);
    }
  };

  // Funciones del App
  const toggleModal = (menu = null) => {
    // Comprobar null, undefined, 0, false, NaN
    setIsEditMode(!!menu);
    // Set el current Menu para trabajar en el modal
    setCurrentMenu(menu || _defaultCurretMenu);
    // Apertura el modal
    setIsModalOpen(!isModalOpen);
  };


  // Maneja el cambio en los inputs del modal
  const handleInputChange = (e) => {
    setCurrentMenu({
      ...currentMenu,
      [e.target.name]: e.target.value
    });
  };

  

  function _MenusKupiCard () {
    return (
      _menusKupi.map((menu) => (
        <Card className="mb-3" key={menu.id}>
          <Row className="g-0 align-items-center">

          <Col md={2} className="text-end p-3 iconsMobile">
            <Button color="light rounded-pill p-3" onClick={() => handleSubmenuRedirect(menu.id)}>
            <KUPIICONS.ListMenu stroke="#690BC8" height="18" width="18" />
            </Button>
            <Button color="light rounded-pill p-3" onClick={() => toggleModal(menu)}>
              <KUPIICONS.Pencil stroke="#690BC8" height="18" width="18" />
            </Button>
          </Col>

            <Col md={2} className="text-center">
              <CardImg
                src={MENUSICONS[menu.iconoMenu]}
                alt={menu?.iconoMenu ? "icon" : "No definido"}
                className='menuIcon'
              />
            </Col>
            <Col md={6}>
              <CardBody>
                <h5 className="card-title mb-3 fw-bold">{menu.nomMenu}</h5>
                <p className="text-muted">URL: {menu.urlReact}</p>
                <p className="text-muted">Orden: {menu.ordItem}</p>
              </CardBody>
            </Col>
            <Col md={2} className="text-center">
              <Button color="light rounded-pill p-3 submenusDesktop" onClick={() => handleSubmenuRedirect(menu.id)}>
              <KUPIICONS.ListMenu stroke="#690BC8" height="18" width="18" />
                  Submenús
              </Button>
            </Col>
            <Col md={2} className="text-center">
              <Button color="light rounded-pill p-3 pencilDesktop" onClick={() => toggleModal(menu)}>
                <KUPIICONS.Pencil stroke="#690BC8" height="18" width="18" />
              </Button>
            </Col>
          </Row>
        </Card>
        )
      )
    );
  }

  function _CardDefault () {
    return (
      <Card>
        <CardHeader>
          <h6>
            No existen datos.
          </h6>
        </CardHeader>
      </Card>
    );
  }

  function _Modal () {
    return (
      <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal} className='fw-bold'>
          {isEditMode ? 'Editar Menú' : 'Agregar Menú'}
        </ModalHeader>
        <ModalBody className='p-4'>
          <Form className='row'>
            <FormGroup className='col-12'>
              <Label for="nomMenu">Nombre</Label>
              <Input
                type="text"
                name="nomMenu"
                id="nomMenu"
                placeholder='Agregar Nombre'
                value={currentMenu.nomMenu}
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
                value={currentMenu.urlReact}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="urlReact">Color</Label>
              <Input
                type="text"
                name="colorMenu"
                id="colorMenu"
                placeholder='Agregar color'
                value={currentMenu.colorMenu}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className='col-6'>
              <Label for="iconoMenu">Icono</Label>
              <Input
                type="text"
                name="iconoMenu"
                placeholder='Agregar Icono'
                id="iconoMenu"
                value={currentMenu.iconoMenu}
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
                value={currentMenu.ordItem}
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
            onClick={saveMenu}
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
      <Container fluid>
        
        <Button 
          color="primary"
          className="rounded-pill fw-bold btnAdd" 
          onClick={() => toggleModal()}
        >
          <KUPIICONS.Plus />
        </Button>

        <Row >
          <Col xl={12}>
            { 
              _menusKupi.length > 0 
              ? _MenusKupiCard()
              : _CardDefault()
            }
          </Col>
        </Row>

        {/* Modal para agregar/editar menú */}
        { _Modal() }
      </Container>
    </>
  );
};