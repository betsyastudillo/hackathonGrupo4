import { Card, CardBody, CardHeader, Col, Container, Row, Button,Form, FormGroup, Label, Input  } from 'reactstrap';

// Iconos
import KUPIICONS from '@/common/icons/icons';


export const WithdrawCash = () => {

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col sm={12} md={8} lg={6} xl={4}>
            <Card>
              <CardHeader className='d-flex align-items-center'>
                <span className='pe-2'>
                  <KUPIICONS.Mail height="20" width="20" />
                </span>
                <h2 className="card-title mb-0 fw-bold">Retirar Efectivo</h2>
                <p className='m-2'>(Mensaje de Texto)</p>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup className='col-md-12'>
                    <Label for="valorRetiro" className='fw-bold mt-3'>Valor a Retirar</Label>
                    <div className="position-relative">
                      <Input
                        style={{
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px #690BC8 solid',
                        }}
                        className="form-control ps-5"
                        type="number"
                        name="valorRetiro"
                        id="valorRetiro"
                        placeholder='Valor'
                        value= ''
                        onChange= ''
                      />
                      <span className="search-icon position-absolute">
                        <KUPIICONS.DollarSign height="20" width="20" />
                      </span>
                    </div>
                  </FormGroup>
                  <FormGroup className='col-md-12'>
                    <Label for="referencia" className='fw-bold mt-3'>Factura / Referencia</Label>
                    <div className="position-relative">
                      <Input
                        style={{
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px #690BC8 solid',
                        }}
                        className="form-control ps-5"
                        type="number"
                        name="referencia"
                        id="referencia"
                        placeholder='Opcional'
                        value= ''
                        onChange= ''
                      />
                      <span className="search-icon position-absolute">
                        <KUPIICONS.ListMenu height="20" width="20" />
                      </span>
                    </div>
                  </FormGroup>
                  <FormGroup className='col-md-12'>
                    <Label for="cedulaCliente"  className='fw-bold mt-3'>Número de cédula del cliente</Label>
                    <div className="position-relative">
                      <Input
                        style={{
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px #690BC8 solid',
                        }}
                        className="form-control ps-5"
                        type="number"
                        name="cedulaCliente"
                        id="cedulaCliente"
                        placeholder='# Cédula'
                        value= ''
                        onChange= ''
                      />
                      <span className="search-icon position-absolute">
                        <KUPIICONS.Card height="20" width="20" />
                      </span>
                    </div>
                  </FormGroup>
                  <div className=" col-12 d-flex justify-content-end">
                    <Button
                      className='mt-3'
                      onClick=""
                      color="primary"
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
      
    </>
  );
}