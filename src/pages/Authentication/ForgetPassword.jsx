import { useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Spinner,
  // Alert,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { forgotPassword } from '@/slices/thunks';
// import { resetLogin } from '@/slices/auth/login/reducer';
import imgKupi from '@/assets/images/loginKupi.webp';
import { LogoKupi } from '@/common/icons/icons';

export const Forgot = () => {
  document.title = 'Forgot Password | Kupi';
  const [userLogin] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, forgot } = useSelector(state => state.Login);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      document: userLogin.document || '',
      typeDocument: userLogin.typeDocument || '2',
    },
    validationSchema: Yup.object({
      typeDocument: Yup.string().required(
        'Debes seleccionar un tipo de documento'
      ),
      document: Yup.string()
        .required('Este campo es obligatorio')
        .matches(/^\d+$/, 'Solo se permiten números')
        .min(7, 'El número de documento debe tener al menos 7 dígitos'),
    }),
    onSubmit: values => {
      dispatch(forgotPassword(values, navigate));
    },
  });

  const isButtonDisabled =
    validation.values.document === '' || validation.values.password === '';

  return (
    <>
      <div className="auth-page-wrapper auth-bg-cover py-3 d-flex justify-content-center align-items-center min-vh-100">
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 20,
            transform: 'translateX(-50%)',
          }}
          className="d-lg-none"
        >
          <LogoKupi />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
          }}
          className="d-none d-lg-block"
        >
          <LogoKupi />
        </div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden">
                  <Row className="g-0">
                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h3
                            className="text-center"
                            style={{ color: '#262626' }}
                          >
                            Olvidé mi clave
                          </h3>
                          {!forgot && (
                            <p className="text-muted text-center">
                              Ingresa tu tipo y número de documento para
                              restablecer tu contraseña.
                            </p>
                          )}
                        </div>

                        {/* {!forgot && ( */}
                        <div className="mt-4">
                          <Form
                            onSubmit={e => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                            action="#"
                          >
                            <div className="mb-4">
                              <Label
                                htmlFor="typeDocument"
                                className="form-label"
                              >
                                Tipo de documento
                              </Label>
                              <select
                                name="typeDocument"
                                value={validation.values.typeDocument || '2'}
                                style={{
                                  borderRadius: 0,
                                  border: 'none',
                                  borderBottom: '1px #690BC8 solid',
                                  backgroundImage: 'none',
                                }}
                                className={`form-select mb-3 text-muted ${
                                  validation.touched.typeDocument &&
                                  validation.errors.typeDocument
                                    ? 'is-invalid'
                                    : ''
                                }`}
                                aria-label="Default select example"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                              >
                                <option value="">Seleccione uno</option>
                                <option value="1">NIT</option>
                                <option value="2">Cédula de ciudadanía</option>
                                <option value="3">Pasaporte</option>
                                <option value="4">Tarjeta de Identidad</option>
                                <option value="5">Cédula de extranjería</option>
                              </select>
                              {validation.touched.typeDocument &&
                              validation.errors.typeDocument ? (
                                <FormFeedback
                                  type="invalid"
                                  style={{
                                    marginTop: '0',
                                  }}
                                >
                                  {validation.errors.typeDocument}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-4">
                              <Label htmlFor="email" className="form-label">
                                No. de documento
                              </Label>
                              <Input
                                style={{
                                  borderRadius: 0,
                                  border: 'none',
                                  borderBottom: '1px #690BC8 solid',
                                  backgroundImage: 'none',
                                }}
                                name="document"
                                className="form-control"
                                placeholder="Ingresa tu número de documento"
                                type="integer"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.document || ''}
                                invalid={
                                  validation.touched.document &&
                                  validation.errors.document
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.document &&
                              validation.errors.document ? (
                                <FormFeedback
                                  type="invalid"
                                  style={{ marginTop: '10px' }}
                                >
                                  {validation.errors.document}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mt-5">
                              <Button
                                color="primary"
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={isButtonDisabled}
                              >
                                {loading ? (
                                  <Spinner size="sm" className="me-2">
                                    {' '}
                                    Loading...{' '}
                                  </Spinner>
                                ) : null}
                                Enviar
                              </Button>
                            </div>
                          </Form>
                          <div className="text-center mt-3">
                            <Link to="/login" className="text-muted">
                              Espera, ya recordé la clave...
                              <span style={{ fontWeight: 'bold' }}>
                                {' '}
                                Iniciar Sesión
                              </span>
                            </Link>
                          </div>
                        </div>
                        {/* )} */}

                        {/* {forgot && (
                          <div className="mt-5">
                            <Alert color="info" isOpen={forgot}>
                              <span className="text-black">
                                Te hemos enviado un mensaje de texto al teléfono
                                ***
                                {msgForgot} con una contraseña temporal, para
                                restablecer tu contraseña.
                              </span>
                            </Alert>
                            <div className="mt-5">
                              <Button
                                color="primary"
                                className="btn btn-primary w-100"
                                onClick={() => navigate('/login')}
                              >
                                Volver al Inicio
                              </Button>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </Col>
                    <Col lg={6} className="d-none d-lg-block">
                      <img src={imgKupi} alt="" height="600" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};
