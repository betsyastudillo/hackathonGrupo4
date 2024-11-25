import { useEffect, useState } from 'react';
import { Card, CardHeader, Col, Label, Input, Container, Row, FormGroup, CardBody, Form } from 'reactstrap';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';

import { useForm } from '../../hooks/useForm';

import ToastKupi from '@/Components/Common/alertsNotification/toast';

import KUPIICONS from '@/common/icons/icons';
import { regPayQRWS, validatePayQRWS, cancelPayQRWS } from '../../slices/thunks';
import Swal from 'sweetalert2';

import {toastDefault } from '../../utilities'

export const GenerarPagoQR = () => {

  const navigate = useNavigate();

  // Extraer valores del selector
  const user = useSelector(state => state.Login.user);
  const [ codQr, setCodQR] = useState('');
  const [ showQR, setShowQR ] = useState(false);
  // Controla las vistas que se muestran
  const [ isGeneratingQR, setIsGeneratingQR ] = useState(true);
  const [ numTransaccion, setNumTransaccion ] = useState('')
  // Contador de segundos para visualizar el QR
  // const [ countDown, setCountDown ] = useState(60);

  const [ showToast, setShowToast ] = useState(toastDefault);

  // Configuración del formulario usando el hook useForm
  const { onInputChange, onResetForm, valor, referencia } = useForm({
    valor: '',        // Estado inicial de valor
    referencia: '',   // Estado inicial de referencia
  });

  const [disableButton, setdisableButton] = useState(true);

  
  // Para el temporizador y para activar el botón
  useEffect(() => {
    let timer;

    // Activar o desactivar el botón
    if(valor && Number(valor) > 0) {
      setdisableButton(false);
    }else {
      setdisableButton(true);
    }

    // Temporizador
    // if (showQR && countDown > 0) {
    //   timer = setInterval(() => {
    //     setCountDown(prev => prev - 1);
    //   }, 1000)
    // } else if (countDown === 0) {
    //   clearInterval(timer);
    //   handleQRCodeExpiration();
    // }
    
    // setdisableButton(true)
    // if (valor.length > 1 ) setdisableButton(false)
    
    return () => clearInterval(timer);
  }, [showQR, valor])
  

  const handlergenerarPagoQR = async e => {
    e.preventDefault();
    
    const dataRequest = {
      token: user.token,
      bodyOptions: {
        valTransaccion: +valor,
        refTransaccion: referencia.length > 0 ? referencia :  " ",
        codVendedor: user.codUsuario.toString(),
        sucursal: user.codSucursal ? user.codSucursal.toString : '0',
        codEmpresa: user.codEmpresa.toString(),
        nitEmpresa: "0",
        tipTransaccion: 0
      }
    };

    try {
      const { data } = await regPayQRWS(dataRequest);
      console.log(data);

      if( data && data.codQr) {
        setCodQR(data.codQr);
        // Guardo el numTransaccion
        setNumTransaccion(data.numTransaccion);
        // Mostramos el QR
        setShowQR(true);
        // Cambiamos de vista
        setIsGeneratingQR(false);
        // Reiniciamos el temporizador
        // setCountDown(60) 
      }

      setShowToast({  title: "Proceso exitoso ",  message: "Código generado satisfactoriamente",  isVisible: true });

    } catch (err) {
      console.log(err);
      const response = err.response || {}; // Asegura que response exista
      setShowToast({ 
        title: `Error ${response.status || ""}`, 
        message: JSON.stringify(response.data || "Ocurrió un error inesperado", null, 2), 
        isVisible: true, 
        type: "danger"
      });
    }

  };

  // const handleQRCodeExpiration = async () => {
  //   await Swal.fire({
  //     title: 'Código QR expirado',
  //     text: 'El código QR ha expirado. Por favor, genere uno nuevamente.',
  //     icon: 'error',
  //     confirmButtonText: 'Continuar',
  //     timer:3000
  //   })
    // Ocultamos el QR y volvermos a la vista para generarlo
  //   setShowQR(false);
  //   setIsGeneratingQR(true);
  // }

  const anularPagoQR = async e => {
    e.preventDefault();
  
    const result = await Swal.fire({
      title: 'Anular pago',
      text: '¿Estás seguro de anular este pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,  // Botones invertidos
      customClass: {
        title: 'custom-title',
        popup: 'custom-popup',
        confirmButton: 'btn btn-primary p-2 m-2 btn_custom', 
        cancelButton: 'btn btn-outline-primary p-2 m-2 btn_custom' 
      },
      buttonsStyling: false
    })

    if (result.isConfirmed) {

      setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });

      const dataRequest = {
        token: user.token,
        bodyOptions: {
          numTransaccion: numTransaccion
        }
      }

      try {
        await cancelPayQRWS(dataRequest);
        setShowToast({ type: "success",  title: " Operación Exitosa",  message: "Se ha anulado el código QR.",  isVisible: true });
        onResetForm();

        // Volver al formulario
        setIsGeneratingQR(true);
        setShowQR(false);

      } catch (err) {

        console.log(err);
        const response = err.response || {}; // Asegura que response exista
        setShowToast({ 
          title: `Error ${response.status || ""}`, 
          message: JSON.stringify(response.data || "Ocurrió un error inesperado", null, 2), 
          isVisible: true, 
          type: "danger"
        });
      } 

    } else if (result.isDismissed) {
      console.log('El usuario canceló la anulación');
    }
  }

  const validarPagoQR = async e => {
    e.preventDefault();

    const dataRequest = {
      token: user.token,
      bodyOptions: {
        numTransaccion: numTransaccion
      }
    }

    try {
      const { data } = await validatePayQRWS(dataRequest);
      
      if (data.codEstado == 3) {
        await Swal.fire({
          title: 'Estado de la transacción',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'Continuar'
        })
        navigate('/mis-ventas')
      } else if (data.codEstado === 4) {
        await Swal.fire({
          title: 'Estado de la transacción',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      } else {
        await Swal.fire({
          title: 'Estado de la transacción',
          text: data.message,
          icon: 'info',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: 'Error de conexión',
        text: 'No se ha podido establecer conexión con el servidor. Por favor, asegúrate de que tu dispositivo esté conectado a internet.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  return (
    <Container>
      <ToastKupi
        title = {showToast.title}    
        message= {showToast.message}
        type  = {showToast.type}     
        isVisible={showToast.isVisible}
        onClose={() => setShowToast(toastDefault)}
      />

      <Row className="justify-content-center">
        <Col xl={8}>
        {isGeneratingQR ? (
          <Card className="bodyTable">
            <CardHeader className="d-flex align-items-center border-1">
              <h2 className="card-title mb-0 fw-bold">Pago QR</h2>
            </CardHeader>
            <CardBody className='p-4'>
              <Form className='row' onSubmit={handlergenerarPagoQR}>
                <FormGroup>
                  <div className='px-3'>
                    <Label for="valor" className='fw-bold'> Valor a pagar </Label>
                    <Input
                      style={{ borderRadius: 0, 
                              border: 'none', borderBottom: '1px #690BC8 solid' }}
                      type="number"
                      name="valor"
                      id="valor"
                      placeholder="$ 0"
                      value={valor}
                      onChange={onInputChange}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="px-3">
                    <Label for="referenciaPago" className='mt-3 fw-bold'>
                      Referencia de pago (Opcional)
                    </Label>
                    <Input
                      style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                      type="text"
                      name="referencia"
                      id="referenciaPago"
                      placeholder="Referencia de pago"
                      value={referencia}
                      onChange={onInputChange}
                    />
                  </div>
                </FormGroup>
                
                <div className="col-12 d-flex justify-content-end mt-3">
                  <button 
                    type="submit"
                    className={`btn btn-primary ${disableButton ? "disabled" : ""}`}
                    disabled={disableButton}
                  >
                    <div className='d-flex'>
                      <KUPIICONS.Barcode fill='#FFFFFF' height='20' width='20'/>
                      <span className='mx-2'>
                        Generar pago QR
                      </span>
                    </div>
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        ) : (
          <Card className="bodyTable">
            <CardHeader className="d-flex align-items-center border-1">
              <h2 className="card-title mb-0 fw-bold">Código QR generado</h2>
            </CardHeader>
            <CardBody className='p-4'>
              <div className="text-center mb-4">
                <QRCode
                  value={codQr}
                  size={200}
                  bgColor="white"
                  style={{
                    height: '250px',
                    width: '250px',
                  }}
                  />
              </div>
              {/* <div className="col-12 d-flex justify-content-start mt-3 p-2"  style={{ 
                backgroundColor: '#e4eef8',
                color: '#236cc8',
                height: '35px',
                alignContent: 'center',
                fontWeight: '600', 
                borderRadius: '10px'
              }}>
                <div className='d-flex '>
                  <KUPIICONS.InfoCircle fill='#236cc8' height='20' width='20'/>
                  <span className='mx-2'>
                    El código QR expirará en {countDown} segundos
                  </span>
                </div>
              </div> */}
              <div className="d-flex justify-content-end mt-3 pt-2">
                <button
                  type="button"
                  className="btn"
                  color="primary"
                  style={{ 
                    marginRight: '10px', 
                    fontWeight: '600'  
                    }}
                  onClick={anularPagoQR}
                >
                  Anular código QR
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{  
                    fontWeight: '600' }}
                  onClick={validarPagoQR}
                >
                  Validar código QR
                </button>
              </div>
                  
                  {/* {!showQR && (
                    <div className="col-12 d-flex justify-content-end mt-5">
                      {/* disabled */}
                      {/* <button type="submit"
                        className={btn btn-primary ${disableButton ? "disabled" : ""}}
                        onClick={ disableButton ? null :  handlergenerarPagoQR}
                      >
                        <div className='d-flex'>
                          <KUPIICONS.Barcode fill='#FFFFFF' height='20' width='20'/>
                          <span className='mx-2'>
                            Generar pago QR
                          </span>
                        </div>
                      </button>
                    </div>
                  )} */}
            </CardBody>
          </Card>
        )}
        </Col>
      </Row>
    </Container>
  );
};
