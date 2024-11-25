import { useState } from 'react';
import {
  Col,
  Form,
  Input,
  Label,
  Row,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { enviarSMS } from '@/slices/thunks';
import Swal from 'sweetalert2';

export const FormEnviarSMS = () => {
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    telefono: '',
    mensaje: '',
  });

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    const smsData = {
      telefono: formValues.telefono,
      mensaje: formValues.mensaje,
    };

    try {
      await dispatch(enviarSMS(smsData));
      await Swal.fire({
        title: 'Envío de Pin',
        text: 'El mensaje se ha reenviado exitosamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 1500,
      });
      setFormValues({ telefono: '', mensaje: '' });
    } catch (error) {
      console.log('Error al enviar el SMS:', error);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col lg={10}>
        <Card>
          <CardBody>
            <CardTitle tag="h5" className="text-center mb-4">
              Enviar SMS
            </CardTitle>
            <Form>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="telefono" className="form-label">
                      Número de Teléfono
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="telefono"
                      placeholder="Ingresa el número de teléfono"
                      value={formValues.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="mb-3">
                    <Label htmlFor="mensaje" className="form-label">
                      Mensaje
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="mensaje"
                      placeholder="Ingresa el mensaje"
                      value={formValues.mensaje}
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
                      Enviar SMS
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
