import BreadCrumb from '../../Components/Common/BreadCrumb';
import { useState } from 'react';
import { Container, Col, Form, Input, Label, Row, Card, CardBody, CardTitle } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { sendPush } from '@/slices/thunks';
import { getFCMTokenByDocumentWS } from '@/slices/users/thunk';
import Swal from 'sweetalert2';

export const SendPush = () => {
  document.title = 'Enviar Push | Kupi Comercios';
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    cedula: '',
    title: '',
    message: '',
  });

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = async () => {

    const { data } = await getFCMTokenByDocumentWS(formValues.cedula);
    console.log(data);
    const pushData = {
      fcm_token: data,
      title: formValues.title,
      message: formValues.message,
    };

    try {
      await dispatch(sendPush(pushData));
      await Swal.fire({
        title: 'Envío de notificación Push',
        text: 'La notificación Push se ha reenviado exitosamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 1500,
      });
      setFormValues({ cedula: '', title: '', message: '' });
    } catch (error) {
      console.log('Error al enviar la notificación push:', error);
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title="Enviar Push"
            pageTitle="Enviar Push"
          />
          <Row>
            <Row className="justify-content-center">
              <Col lg={10}>
                <Card>
                  <CardBody>
                    <CardTitle tag="h5" className="text-center mb-4">
                      Enviar Push
                    </CardTitle>
                    <Form>
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="cedula" className="form-label">
                              Cédula
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cedula"
                              placeholder="Ingresa la cédula del usuario"
                              value={formValues.cedula}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label htmlFor="title" className="form-label">
                              Título 
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="title"
                              placeholder="Ingresa el título de la notificación"
                              value={formValues.title}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Label htmlFor="message" className="form-label">
                              Mensaje
                            </Label>
                            <Input
                              type="textarea"
                              className="form-control"
                              id="message"
                              placeholder="Ingresa el mensaje"
                              value={formValues.message}
                              onChange={handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSubmit}
                            >
                              Enviar Push
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </>
  );
};
