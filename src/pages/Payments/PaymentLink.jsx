import { Card, CardBody, CardHeader, Col, Container, Row, Button, Form, FormGroup, Label, Input  } from 'reactstrap';

export const PaymentLink = () => {

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={6}>
            <Card className="bodyTable">
              <CardHeader>
                <h2 className="card-title mb-0 fw-bold">Generar Link</h2>
              </CardHeader>
              <CardBody className='p-4'>
                <Form className='row'>
                  <FormGroup>
                    <Label for="valorPago" className='fw-bold'>Valor a pagar</Label>
                      <Input
                        style={{
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px #690BC8 solid',
                        }}
                        type="number"
                        name="valorPago"
                        id="valorPago"
                        placeholder='$100.000'
                        value= ''
                        onChange= ''
                      />
                  </FormGroup>
                  <FormGroup>
                    <Label for="referenciaPago" className='fw-bold mt-3'>Referencia de pago (opcional)</Label>
                      <Input
                        style={{
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px #690BC8 solid',
                        }}
                        type="text"
                        name="referenciaPago"
                        id="referenciaPago"
                        placeholder='Referencia de pago'
                        value= ''
                        onChange= ''
                      />
                  </FormGroup>
                  <div className="col-12 d-flex justify-content-end mt-3">
                    <Button
                      onClick=""
                      color="primary"
                    >
                      Generar Link
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