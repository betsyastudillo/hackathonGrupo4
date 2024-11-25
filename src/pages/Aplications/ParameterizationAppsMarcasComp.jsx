import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppMarcaDetWS, updateAppMarcaCompWS } from '../../slices/parameterizationsApps/thunk';
import { Card, CardHeader, CardBody, Col, Container, Row, Button, Input, FormGroup, Label } from 'reactstrap';
import ToastKupi from '@/Components/Common/alertsNotification/toast';


//Estilo
import '@/pages/Aplications/styles/index.scss';

export const ParameterizationAppsMarcasComp = () => {

  const { codApp } = useParams();
  const navigation = useNavigate();

  const _defaultCurrentAppDet = {
    codApp: '',
    nomApp: '',
    codEmpresa: 0,
    imgLogo: ' ',
    imgHead: ' ',
    colApp1: ' ',
    colApp2: ' ',
    colApp3: ' ',
    colApp4: ' ',
    colApp5: ' ',
    colApp6: ' ',
    colApp1Nuevo: ' ',
    colApp2Nuevo: ' ',
    colApp3Nuevo: ' ',
    colApp4Nuevo: ' ',
    colApp5Nuevo: ' ',
    colApp6Nuevo: ' ',
    retiroSaldo: ' ',
    campo2: ' ',
    campo3: ' ',
    campo4: ' ',
    campo5: ' ',
    compromisos: 0,
    soat: 0,
    pasacupo: 0,
    recargas: 0,
    suscripciones: 0,
    paquetes: 0,
    usrCreacion: 0,
    fecCreacion: ' ',
    usrEdicion: 0,
    fecEdicion: ' ',
    registrar: 0,
    url_tyc: ' ',
    url_ptd: ' ',
    linea_purpura: ' ',
    soporte_tel: ' ',
    soporte_whatsapp: ' '
  }

  // Use State
  const [currentAppDet, setCurrentAppDet] = useState(_defaultCurrentAppDet);

  // Manejador del Alert
  const [showToast, setShowToast] = useState({
    title  : "",  message: "",
    type   : "success",  isVisible: false
  });


  // Use effects
  useEffect(() => {
    if (codApp) {
      getInfoAppDet(codApp)
    }
  }, [codApp]);


  // Web Services or Calling to Api
  const getInfoAppDet = async (codApp) => {
    try {      

      const { data } = await getAppMarcaDetWS({
        params: codApp, bodyOptions: [] });
      
      setCurrentAppDet(data)

    } catch (err) {
      console.error('Error fetching info detallada de app marca compartida:', err);
    }
  }


  // Guardar los datos de la marca
  const saveInfoAppDet = async () => {

    setShowToast({
      title  : "Procesando...",  
      message: "Por favor espere",
      type   : "",  
      isVisible: true
    });

    try {

      // Creamos un nuevo objeto sin el campo codApp
      const { codApp, ...bodyOptions } = currentAppDet

      // Obtenemos  el usuario del localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const codUsuario = user?.codUsuario;

      // Generamos la fecha de edición actual en formato ISO
      const fecEdicion = new Date().toISOString();

      // Añadimos el usuario y la fecha actual al bodyOptions
      const updateBodyOptions = {
        ...bodyOptions,
        usrEdicion: codUsuario,
        fecEdicion: fecEdicion
      }

      // Editamos el menú existente
      const data = {
        params: codApp,
        bodyOptions:updateBodyOptions
      }
      
      await updateAppMarcaCompWS(data);

      setShowToast({
        title: "Actualizado exitosamente",
        message: "Los cambios han sido guardados.",
        type: "success",
        isVisible: true
      });
      
      setTimeout(() => {
        navigation(-1); // Regresar a la página anterior
      }, 2000); 

    
    } catch (error) {
      const { response } = error;
      console.log(response);
      const jsonString = JSON.stringify(response.data, null, 2);

      setShowToast({
        title  :  `Error ${response?.status || 'desconocido'}`, 
        message: jsonString,
        type   : "danger",  isVisible: true
      });
    }
  };

  // Maneja el cambio en los inputs 
  const handleInputChange = (e) => {
    setCurrentAppDet({
      ...currentAppDet,
      [e.target.name]: e.target.value
    });
  };


  const fields = [
    {label: "Código App", name: "codApp", type: "number"},
    {label: "Nombre App", name: "nomApp", type: "text"},
    {label: "Código Empresa", name: "codEmpresa", type: "number"},
    {label: "Imagen Logo", name: "imgLogo", type: "text"},
    {label: "Imagen Cabecera", name: "imgHead", type: "text"},
    {label: "Color 1", name: "colApp1", type: "text"},
    {label: "Color 2", name: "colApp2", type: "text"},
    {label: "Color 3", name: "colApp3", type: "text"},
    {label: "Color 4", name: "colApp4", type: "text"},
    {label: "Color 5", name: "colApp5", type: "text"},
    {label: "Color 6", name: "colApp6", type: "text"},
    {label: "Nuevo Color 1", name: "colApp1Nuevo", type: "text"},
    {label: "Nuevo Color 2", name: "colApp2Nuevo", type: "text"},
    {label: "Nuevo Color 3", name: "colApp3Nuevo", type: "text"},
    {label: "Nuevo Color 4", name: "colApp4Nuevo", type: "text"},
    {label: "Nuevo Color 5", name: "colApp5Nuevo", type: "text"},
    {label: "Nuevo Color 6", name: "colApp6Nuevo", type: "text"},
    {label: "Retiro Saldo", name: "retiroSaldo", type: "number"},
    {label: "Seguros Exequiales", name: "campo2", type: "text"},
    {label: "Registra tu entidad", name: "campo3", type: "text"},
    {label: "Nuevos Comercios Banner", name: "campo4", type: "text"},
    {label: "Huella", name: "campo5", type: "text"},
    {label: "Compromisos", name: "compromisos", type: "number"},
    {label: "Soat", name: "soat", type: "number"},
    {label: "Pasacupo", name: "pasacupo", type: "number"},
    {label: "Recargas", name: "recargas", type: "number"},
    {label: "Suscripciones", name: "suscripciones", type: "number"},
    {label: "Paquetes", name: "paquetes", type: "number"},
    {label: "Registrar", name: "registrar", type: "number"},
    {label: "URL T&C", name: "url_tyc", type: "text"},
    {label: "URL PTD", name: "url_ptd", type: "text"},
    {label: "Línea Púrpura", name: "linea_purpura", type: "text"},
    {label: "Teléfono Soporte", name: "soporte_tel", type: "text"},
    {label: "Whatsapp Soporte", name: "soporte_whatsapp", type: "text"},
  ]


  const _cardHeader = () =>{ 
    return (
      <CardHeader
        className="align-items-center border-1 d-flex"
        style={{ borderRadius: '10px' }}
      > 
        <h4 className="card-title mb-0 flex-grow-1">
          Editar
        </h4>
      </CardHeader>
    )
  }


  function _cardBody(){
    return (
      <CardBody>
        <Row>
          {fields.map((field) => (
            <Col key={field.name} sm={12} md={6} lg={2} className='mb-1 card-inputs'>
              <FormGroup>
                <Label for={field.name}>{field.label}</Label>
                <Input
                  id={codApp}
                  name={field.name}
                  type={field.type}
                  value={currentAppDet[field.name]} 
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          ))}
          <div className='d-flex justify-content-end'>
            <Button 
              color="" 
              onClick={() => navigation(-1)}
              style={{ 
                backgroundColor: '#DDF580', 
                marginRight: '15px'
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={saveInfoAppDet}
              color="primary"
            >
              Actualizar
            </Button>
          </div>
        </Row>
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