import { useEffect, useState } from 'react';
import { Card, CardHeader, Col, Row, Label, Input, Form, FormGroup } from 'reactstrap';

import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks/useForm';
import { useSelector } from 'react-redux';

import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { formPinDefault, toastDefault } from '@/utilities';
import KUPIICONS from '@/common/icons/icons';
import { cancelPayPendingWS, doPayPinWS, regPayPinWS, resendPinVozWS, resendPinWS } from '@/slices/thunks';

import Swal from 'sweetalert2';


export const PagosView = ({ title= "Generar Pago con PIN", btnText = "Enviar Pin", title2= "Pagar con SMS (Mensaje de Texto)", typePayment = 0}) => {

  const navigate = useNavigate();
  const user = useSelector(state => state.Login.user);

  const [formData, setFormData]             = useState( formPinDefault );
  const [ showToast, setShowToast ]         = useState( toastDefault );
  const [showSecondCard, setShowSecondCard] = useState( false );
  const [disableButton, setdisableButton]   = useState(true);
  const [numTransaccion, setNumTr]          = useState( );

  const { onInputChange: onInputChangeR, onResetForm: onResetFormR, pin } 
  = useForm( { pin: '' } );

  const { onInputChange, onResetForm, valor, referencia, cedula } = useForm({
    valor: '',
    referencia: '',
    cedula: '',
  });

  useEffect(() => {
    setdisableButton(true)
    if (valor.length > 1 && cedula.length > 3 ) setdisableButton(false)
  }, [valor, cedula])


  const handlerGenerarPagoPIN = async e => {
    e.preventDefault();
    
    setdisableButton(true)
    setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });

    const dataRequest = {
      token: user.token, 
      bodyOptions: {
        numIdentificacion: cedula.toString(),
        valTransaccion: +valor,
        sucursal: user.codSucursal ? user.codSucursal.toString : '0',
        refTransaccion: referencia.length > 0 ?  referencia : " ",
        tipTransaccion: typePayment
      }
    }

    try {
      const {data} = await regPayPinWS(dataRequest);
      console.log(data);
      setNumTr(data.numTransaccion);
      setShowSecondCard(true);

    } catch (err) {
      setShowToast({ 
        title: `Error ${err.status || ""}`, 
        message: JSON.stringify(err.data.message || "Ocurrió un error inesperado", null, 2), 
        isVisible: true, 
        type: "danger"
      });
    } finally {
      setdisableButton(false)
    }
  }


  const handlerReenviarPIN    = async e => {
    e.preventDefault();
    setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });
    const dataRequest = {
      token: user.token, 
      bodyOptions: {
        numTransaccion: numTransaccion.toString(),
      }
    }

    try {
      const {data} = await resendPinWS(dataRequest);
      console.log(data);
      setShowToast({ type: "success",  title: " Operación Exitosa",  message: "Se ha reenviado el pin al usuario",  isVisible: true });
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

  }


  const handlerReenviarPINVoz = async e => {
    e.preventDefault();
    setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });

    const dataRequest = {
      token: user.token, 
      bodyOptions: {
        numTransaccion: numTransaccion.toString(),
      }
    }

    try {
      const {data} = await resendPinVozWS(dataRequest);
      console.log(data);
      setShowToast({ type: "success",  title: " Operación Exitosa",  message: "Se ha reenviado el pin al usuario",  isVisible: true });
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
  }

  const handlerAnularPago = async e => {
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
    });

    if (result.isConfirmed) {

      
      setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });

      const dataRequest = {
        token: user.token, 
        bodyOptions: {
          numTransaccion: numTransaccion.toString(),
        }
      }
  
      try {
        const {data} = await cancelPayPendingWS(dataRequest);
        console.log(data);
        setShowToast({ type: "success",  title: " Operación Exitosa",  message: "Se ha anulado el pin",  isVisible: true });
        onResetForm();
        setShowSecondCard(false);
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
    }  else if (result.isDismissed) {
      console.log('El usuario canceló la anulación');
    }
    
  }
  
  const handlerValidarPagoPIN = async e => {
    e.preventDefault();
    setShowToast({  title: " Procesando... ",  message: " Por favor espere",  isVisible: true });

    const dataRequest = {
      token: user.token, 
      bodyOptions: {
        numIdentificacion: cedula,
        pinTransaccion: +pin,
        tipTransaccion: typePayment
      }
    }

    try {
      const {data} = await doPayPinWS(dataRequest);
      console.log(data);

      const result = await Swal.fire({
        title: 'Pago Realizado',
        text: 'El pago se ha procesado correctamente.',
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: 'Imprimir',
        confirmButtonText: 'Continuar',
        customClass: {
          title: 'custom-title',
          popup: 'custom-popup',
          confirmButton: 'btn btn-primary p-2 m-2 btn_custom', 
          cancelButton: 'btn btn-outline-primary p-2 m-2 btn_custom' 
        },
        buttonsStyling: false
      });

      console.log(result);

      if (result.isConfirmed) { // Confirmar
        onResetForm();
        setShowSecondCard( false );
      }

      if (result.isDismissed) { // Imprimir
        navigate('/mis-ventas');
      }

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

  }


  const PrimerFormulario = () => {
    return(
      <Col xl={11}>
        <Card className="card-height-100" style={{ borderRadius: '10px' }}>
          
          <CardHeader  className="align-items-center border-1 d-flex" style={{ borderRadius: '10px' }} >
            <h4 className="card-title mb-0 flex-grow-1"> {title} </h4>
          </CardHeader>

          <div className="card-body p-0">
            <Form className="p-5" onSubmit={handlerGenerarPagoPIN}>
              <FormGroup className="mb-5">

                <Label for="valor" className="fw-bold text-primary"> Valor </Label>
                <Input
                  style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid', }}
                  placeholder="$ 0.000"
                  type="number"
                  name="valor"
                  value={valor}
                  onChange={onInputChange}
                />

              </FormGroup>
              <FormGroup className="mb-5">
                
                <Label htmlFor="referencia" className="fw-bold text-primary" > Factura / Referencia (Opcional) </Label>
                <Input
                  style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                  placeholder="Nro de Fact o Referencia "
                  type="text"
                  name="referencia"
                  value={referencia}
                  onChange={onInputChange}
                /> 

              </FormGroup>
              <FormGroup className="mb-5">

                <Label htmlFor="cedula" className="fw-bold text-primary" > No. de Cédula </Label>
                <Input
                  style={{  borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                  placeholder="Nro. Documento"
                  type="number"
                  name="cedula"
                  value={cedula}
                  onChange={onInputChange}
                />
                
              </FormGroup>

              <div className="d-flex justify-content-end mt-3 pt-2">
                <button 
                  type="submit"
                  className={`btn btn-primary ${disableButton ? "disabled" : ""}`}
                  disabled={disableButton}
                >
                  <div className='d-flex'>
                    <KUPIICONS.Mobile fill='#FFFFFF' height='20' width='20'/>
                    <span className='mx-2'>
                      {btnText}
                    </span>
                  </div>
                </button>
              </div>
            </Form>
          </div>
        </Card>
      </Col>
    );
  }


  const FormularioPago = () => {
    return (
      <Col xl={10}>
        <Card className="card-height-100" style={{ borderRadius: '10px' }}>
          <CardHeader
            className="align-items-center border-1 d-flex"
            style={{ borderRadius: '10px' }}
          >
            <h4 className="card-title mb-0 flex-grow-1"> {title2} </h4>
          </CardHeader>
          <div className="card-body p-0">
            <Form className="p-5">
              <FormGroup className="mb-5">
                <Label for="valor" className="fw-bold text-primary" > Valor </Label>
                <Input
                  style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                  className="form-control"
                  placeholder="$ 00.000"
                  type="integer"
                  value={valor}
                  disabled
                />
              </FormGroup>
              <FormGroup className="mb-5">
                <Label for="referencia" className="fw-bold text-primary" >Factura / Referencia (Opcional) </Label>
                <Input
                  style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                  className="form-control"
                  type="text"
                  value={referencia}
                  disabled
                />
              </FormGroup>
              <FormGroup className="mb-5">
                <Label for="pin" className="fw-bold text-primary" > PIN de Pago (Enviado al Cliente) </Label>
                <Input
                  style={{ borderRadius: 0, border: 'none', borderBottom: '1px #690BC8 solid' }}
                  className="form-control"
                  placeholder="0000"
                  type="number"
                  name="pin"
                  value={pin}
                  onChange={onInputChangeR}
                />
              </FormGroup>
              <div className="d-flex justify-content-between mt-3 pt-2">
                <div className='d-flex justify-content-start'>
              
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{ marginRight: '10px', width: '200px' }}
                    onClick={handlerReenviarPINVoz}
                  >
                    Reenviar con Voz
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{ marginRight: '10px', width: '200px' }}
                    onClick={handlerReenviarPIN}
                  >
                    Reenviar SMS
                  </button>
                </div>

                <div className='d-flex justify-content-end'>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{ marginRight: '10px', width: '200px' }}
                    onClick={handlerAnularPago}
                  >
                    Anular Pago
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '200px' }}
                    onClick={handlerValidarPagoPIN}
                  >
                    Validar Pago
                  </button>
                </div>

              </div>
            </Form>
          </div>
        </Card>
      </Col>
    )
  }
  return ( 
    <>
      <ToastKupi
        title = {showToast.title}    
        message= {showToast.message}
        type  = {showToast.type}     
        isVisible={showToast.isVisible}
        onClose={() => setShowToast(toastDefault)}
      />

      <Row className="justify-content-center">
        { !showSecondCard ?  PrimerFormulario() : FormularioPago() }
      </Row>
    </>
  );
};
