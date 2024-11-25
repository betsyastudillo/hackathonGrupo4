import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getInfoUserWS, getClassBondsForCodEmpresaWS } from '../../../slices/bonds/thunk';
import { Card, CardHeader, CardBody, Col, Container, Row, Button, Input, FormGroup, Label, Form } from 'reactstrap';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import KUPIICONS from '@/common/icons/icons';
import SearchableSelect from '@/Components/Common/select/searchableSelect';



//Estilo
import '@/pages/Aplications/styles/index.scss';

export const _AssignBonusView = () => {

  const { numDocumento } = useParams();

  const { user } = useSelector(state => state.Login);
  const codFinanciadora = user.codEmpresa

  const _defaultCurrentInfoUser = {
    codGenero: null,
    cupoAsignado: 0,
    codOrigen: 1,
    nomUsuario: ' ',
    codCiudad: 0,
    clvUsuario: ' ',
    usrCreacion: 0,
    apeUsuario: ' ',
    codEstado: 0,
    fcmToken: ' ',
    numDocumento: ' ',
    valBono: 0,
    resetOTP: ' ',
    fecCreacion:' ',
    tipoDocumento: ' ',
    valCupo: 0,
    fecNacimiento: ' ',
    telUsuario: ' ',
    valSubsidio: 0,
    codFinancia: 0,
    emaUsuario: ' ',
    valPasacupo: 0,
    urlIcon: ' ',
    codUsuario: 0,
    dirUsuario: null,
    codCupo: 0
  }

  // Use State
  const [currentInfoUser, setCurrentInfoUser] = useState(_defaultCurrentInfoUser);
  const [classBonds, setClassBonds] = useState([]);
  const [currentClassBonds, setCurrentClassBonds] = useState([]);

  // Manejador del Alert
  const [showToast, setShowToast] = useState({
    title  : "",  message: "",
    type   : "success",  isVisible: false
  });


  // Use effects
  useEffect(() => {
    if (numDocumento) {
      getInfoUser(numDocumento);
      getClassBonds(codFinanciadora);
    }
  }, [numDocumento, codFinanciadora]);


  // Web Services or Calling to Api
  const getInfoUser = async (numDocumento) => {
    try {      

      const { data } = await getInfoUserWS({
        params: numDocumento });
      
        setCurrentInfoUser(data)

    } catch (err) {
      console.error('Error fetching info detallada de user:', err);
    }
  }


  const getClassBonds = async (codFinanciadora) => {
    try {      

      const { data } = await getClassBondsForCodEmpresaWS({
        token: user.token,
        params: codFinanciadora });
      console.log("data", data)
        setClassBonds(data)

    } catch (err) {
      console.error('Error fetching class of bonds for company:', err);
    }
  }


  // Maneja el cambio en los inputs 
  const handleInputChange = (e) => {
    const [claseBono, nomBono] = e.target.value

    setCurrentClassBonds({
      ...currentClassBonds,
      claseBono,
      nomBono
    });
  };


  const _cardInfoUser = () => (
    <Col xl={3} lg={5} md={6} sm={12}>
      <Card className="align-items-center border-1 d-flex"
          style={{ borderRadius: '20px' }}>
          <div className='m-3 text-center'>
            <div className="d-flex align-items-center mb-2">
              <KUPIICONS.User height='16' width='16' stroke="#262626"/>
              <h1 className="card-title fw-bold m-2">
                {currentInfoUser.nomUsuario} {currentInfoUser.apeUsuario}
              </h1>
            </div>
            <div className="d-flex align-items-center">
              <KUPIICONS.Card height='16' width='16' stroke="#262626"/>
              <h4 className="card-title m-2">
              {currentInfoUser.numDocumento}
              </h4>
            </div>
          </div>
      </Card>
    </Col>
  );


  const classBondsOptions = classBonds.map(bonds => ({
    value: `${bonds.claseBono}-${bonds.nomBono}`,
    label: `${bonds.nomBono}`,
  }));


  function _cardAssignBond(){
    return (
      <Col sm={12} md={8} lg={6} xl={4}>
        <Card>
          <CardHeader className='d-flex align-items-center'>
          <h2 className="card-title mb-0 fw-bold">Enviar Bono</h2>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup className='col-md-12'>
              <SearchableSelect
                title="Tipo de Bono"
                options={classBondsOptions}
                placeholder="Selecciona un tipo de bono"
                onChange={handleInputChange}
                selectedValue={`${currentClassBonds.claseBono}-${currentClassBonds.nomBono}`}
                />
              </FormGroup>
              {/* División */}
              <div className='divider' 
                style={{
                  borderTop: '1px solid #d3d3d3',
                  margin: '1rem 0',
                  opacity: '0.6',
              }}></div>
              <FormGroup className='col-md-12'>
                <Label for="valor" >Valor</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='valor'
                    id='valor'
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.DollarSign height="20" width="20" />
                  </span>
                </div>
              </FormGroup>
              <FormGroup className='col-md-12'>
                <Label>Observaciones</Label>
                <div className="position-relative">
                  <Input
                    className='form-control ps-5'
                    type='text'
                    name='observaciones'
                    id='observaciones'
                  />
                  <span className="search-icon position-absolute">
                    <KUPIICONS.ListMenu height="20" width="20" />
                  </span>
                </div>
              </FormGroup>
            </Form>
          </CardBody>
          <div className='col-12 d-flex justify-content-end'>
            <Button 
              className='m-3'
              // onClick={saveInfoAppDet}
              color="primary"
            >
              Enviar Bono
            </Button>
          </div>
        </Card>
      </Col>
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
      <Container>
        <Row className="d-flex align-items-center vh-100 flex-column">
          {_cardInfoUser()}
          {_cardAssignBond()}
        </Row>
      </Container>

    </>
  );
};