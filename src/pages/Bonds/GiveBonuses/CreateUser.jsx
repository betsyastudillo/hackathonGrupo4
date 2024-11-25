import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createUserByFinancier } from '../../../slices/bonds/thunk';
import { Card, CardHeader, CardBody, Col, Container, Row, Button, Input, FormGroup, Label, Form } from 'reactstrap';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../../utilities';
import KUPIICONS from '@/common/icons/icons';


//Estilo
import '@/pages/Aplications/styles/index.scss';

export const _CreateUserView = () => {

  const navigate = useNavigate();

  const user = useSelector(state => state.Login.user);


  const _defaultCreateUser = {
    nomUsuario: '',
    apeUsuario: '',
    numDocumento: '',
    telUsuario: '',
    emaUsuario: ''
  }

  // Use State
  const [currentCreateUser, setCurrentCreateUser] = useState(_defaultCreateUser);
  const [ showToast, setShowToast ] = useState(toastDefault);


  const validateForm = () => {
    const { nomUsuario, apeUsuario, numDocumento, telUsuario, emaUsuario } = currentCreateUser;
  
    if (!nomUsuario || !apeUsuario || !numDocumento || !telUsuario || !emaUsuario) {
      setShowToast({
        title: "Error",
        message: "Todos los campos son obligatorios",
        type: "danger",
        isVisible: true
      });
      return false;
    }
    return true;
  };


  // Web Services or Calling to Api
  const createUser = async () => {
    try {      

      const data = {
        token: user.token, 
        bodyOptions: {
          nomUsuario: currentCreateUser.nomUsuario || '',
          apeUsuario: currentCreateUser.apeUsuario || '',
          numDocumento: currentCreateUser.numDocumento || '',
          telUsuario: currentCreateUser.telUsuario || '',
          emaUsuario: currentCreateUser.emaUsuario || '',
        } 
      }

      await createUserByFinancier(data)

      setShowToast({
        title: "Creado exitosamente",
        message: "El usuario ha sido creado.",
        type: "success",
        isVisible: true
      });

      setTimeout(() => {
        navigate(`/lista-usuarios-financiadora`);
      }, 2000); 

    } catch (err) {
      console.error('Error creating user:', err);
      setShowToast({
        title: "Error",
        message: "No se pudo crear el usuario. Intenta de nuevo.",
        type: "danger",
        isVisible: true
      });
    }
  }
  
  
  // Maneja el cambio en los inputs 
  const handleInputChange = (e) => {
    setCurrentCreateUser({
      ...currentCreateUser,
      [e.target.name]: e.target.value
    });
  };
  
    
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (validateForm()) {
        createUser();
      }
    };
  

  const _cardHeader = () =>{ 
    return (
      <CardHeader
        className="align-items-center border-1 d-flex"
        style={{ borderRadius: '10px' }}
      > 
        <h4 className="card-title mb-0 flex-grow-1">
          Crear Usuario
        </h4>
      </CardHeader>
    )
  }


  function _cardBody(){
    return (
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="nomUsuario">Nombre</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='nomUsuario'
                    id='nomUsuario'
                    placeholder='Agregar nombres'
                    value={currentCreateUser.nomUsuario}
                    onChange={handleInputChange}
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.User height="16" width="16" />
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="apeUsuario">Apellidos</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='apeUsuario'
                    id='apeUsuario'
                    placeholder='Agregar apellidos'
                    value={currentCreateUser.apeUsuario}
                    onChange={handleInputChange}
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.User height="16" width="16" />
                  </span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="numDocumento">Número documento</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='numDocumento'
                    id='numDocumento'
                    placeholder='Agregar # documento'
                    value={currentCreateUser.numDocumento}
                    onChange={handleInputChange}
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.Card height="16" width="16" />
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="telUsuario">Celular (para notificaciones)</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='telUsuario'
                    id='telUsuario'
                    placeholder='Agregar # celular'
                    value={currentCreateUser.telUsuario}
                    onChange={handleInputChange}
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.Smartphone height="16" width="16" fill='None' />
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="emaUsuario">Correo electrónico</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='emaUsuario'
                    id='emaUsuario'
                    placeholder='Agregar correo electrónico'
                    value={currentCreateUser.emaUsuario}
                    onChange={handleInputChange}
                />
                <span className="search-icon position-absolute">
                    <KUPIICONS.Mail height="16" width="16" />
                  </span>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button 
              type='submit'
              color="primary"
            >
              Registrar
            </Button>
          </div>
        </Form>
      </CardBody>

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
        <Row className='justify-content-center m-2'>
          <Col xl={12}>
            <Card className='card-height-60 br-10'>
              {_cardHeader()}
              { _cardBody()}
            </Card>
            
          </Col>
        </Row>
      </Container>
    </>
  );
};