import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { getAllFinanciersWS } from '../../../slices/accounting/thunk';
import { Card, CardHeader, CardBody, Col, Container, Row, Button, Input, FormGroup, Label, Form } from 'reactstrap';

import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../../utilities';
import SearchableSelect from '@/Components/Common/select/searchableSelect';
import KUPIICONS from '@/common/icons/icons';


//Estilo
import '@/pages/Aplications/styles/index.scss';

export const _CreateInvoicerFinView = () => {

  // const _defaultCreateInvoicer = {
  //   numFacturaE: '',
  //   tipoDocE: '',
  //   numDocumento: '',
  //   telUsuario: '',
  //   emaUsuario: ''
  // }

  // Use State
  const [financier, setFinancier] = useState([]);
  const [currentFinancier, setCurrentFinancier] = useState([]);
  // const [currentInvoicer, setCurrentInvoicer] = useState(_defaultCreateInvoicer);
  const [ showToast, setShowToast ] = useState(toastDefault);

  useEffect(() => {
    getAllFinancier();

  }, [])
  // const validateForm = () => {
  //   const { nomUsuario, apeUsuario, numDocumento, telUsuario, emaUsuario } = currentCreateUser;
  
  //   if (!nomUsuario || !apeUsuario || !numDocumento || !telUsuario || !emaUsuario) {
  //     setShowToast({
  //       title: "Error",
  //       message: "Todos los campos son obligatorios",
  //       type: "danger",
  //       isVisible: true
  //     });
  //     return false;
  //   }
  //   return true;
  // };


  // Web Services or Calling to Api
  
  const getAllFinancier = async () => {
    try {      

      const { data } = await getAllFinanciersWS()

      setFinancier(data)

    } catch (err) {
      console.error('Error fetching financier:', err);
    }
  }


  // Maneja el cambio en los inputs 
  const handleInputChange = (selectedOption) => {

    if (!selectedOption || !selectedOption.value) {
      return;
    }
  
    const [codEmpresa, nomEmpresa] = selectedOption.value.split("-");
    setCurrentFinancier({
      codEmpresa, 
      nomEmpresa, 
    });
  };
  
  

  function _cardCreate(){
    return (
      <Row className='justify-content-center'>
        <Col xl={6}>
          <Card>
            <CardHeader
              className="align-items-center border-1 d-flex"
              style={{ borderRadius: '10px' }}
            > 
            <h4 className="card-title mb-0 flex-grow-1">
              Agregar Factura 
            </h4>
            </CardHeader>
            <CardBody>
              <Form 
                // onSubmit={handleSubmit}
                >
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="numFacturaE">Núm. factura electrónica</Label>
                        <Input
                          className='form-control ps-5'
                          type='number'
                          name='numFacturaE'
                          id='numFacturaE'
                          // value={currentCreateUser.numFacturaE}
                          // onChange={handleInputChange}
                        />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="tipoDocE">Tipo documento</Label>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='tipoDocE'
                          id='tipoDocE'
                          // value={currentCreateUser.tipoDocE}
                          // onChange={handleInputChange}
                        />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="centroCosto">Centro costo</Label>
                      <Input
                        className='form-control ps-5'
                        type='text'
                        name='centroCosto'
                        id='centroCosto'
                        // value={currentCreateUser.centroCosto}
                        // onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecCompro">Fecha compromiso</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='date'
                          name='fecCompro'
                          id='fecCompro'
                          // value={currentCreateUser.fecCompro}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.Calendar height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecInicial">Fecha inicial</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='fecInicial'
                          id='fecInicial'
                          // value={currentCreateUser.fecInicial}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.Calendar height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecFinal">Fecha final</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='fecFinal'
                          id='fecFinal'
                          // value={currentCreateUser.fecFinal}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.Calendar height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="valFactura">Valor de factura</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='valFactura'
                          id='valFactura'
                          // value={currentCreateUser.valFactura}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.DollarSign height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="valDescuento">Valor de descuento</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='valDescuento'
                          id='valDescuento'
                          // value={currentCreateUser.valDescuento}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.Percent height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="emaUsuario">Valor uso plataforma</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='emaUsuario'
                          id='emaUsuario'
                          // value={currentCreateUser.emaUsuario}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.DollarSign height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="emaUsuario">Valor de compromiso</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='emaUsuario'
                          id='emaUsuario'
                          // value={currentCreateUser.emaUsuario}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.DollarSign height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="emaUsuario">Valor pagado</Label>
                      <div className='position-relative'>
                        <Input
                          className='form-control ps-5'
                          type='text'
                          name='emaUsuario'
                          id='emaUsuario'
                          // value={currentCreateUser.emaUsuario}
                          // onChange={handleInputChange}
                        />
                        <span className="search-icon position-absolute">
                          <KUPIICONS.DollarSign height="16" width="16" fill="none" />
                        </span>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="emaUsuario">Observación</Label>
                      <Input
                        className='form-control ps-5'
                        type='text'
                        name='emaUsuario'
                        id='emaUsuario'
                        // value={currentCreateUser.emaUsuario}
                        // onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup className='col-md-12'>
                      <SearchableSelect
                        title="Financia"
                        options={financierOptions}
                        placeholder="Selecciona una financiadora"
                        onChange={handleInputChange}
                        value={financierOptions.find(
                          (option) =>
                            option.value === `${currentFinancier.codEmpresa}-${currentFinancier.nomEmpresa}`) || null}
                        />
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
          </Card>
        </Col>
      </Row>

    )
  }


  const financierOptions = financier.map(fin => ({
    value: `${fin.codEmpresa}-${fin.nomEmpresa}`,
    label: `${fin.nomEmpresa}`,
  }));


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
              { _cardCreate()}
            
          </Col>
        </Row>
      </Container>
    </>
  );
};