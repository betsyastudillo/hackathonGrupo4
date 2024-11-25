import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import KUPIICONS from '@/common/icons/icons';
import VerificationInput from 'react-verification-input';
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
  Modal,
  ModalBody,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { validateOTP, recoverPass } from '@/slices/thunks';
// import { resetLogin } from '@/slices/auth/login/reducer';
import imgKupi from '@/assets/images/loginKupi.webp';
import { LogoKupi } from '@/common/icons/icons';

export const Recover = () => {
  document.title = 'Forgot Password | Kupi';
  const location = useLocation();
  const { tipoDocumento, numDocumento } = location.state || {};
  const [verificationCode, setVerificationCode] = useState('');
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLogin] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, msgForgot, openModalRecover, validate } = useSelector(
    state => state.Login
  );

  useEffect(() => {
    if (openModalRecover !== undefined) {
      setmodal_backdrop(openModalRecover);
    }
  }, [openModalRecover]);

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
  }

  const handleCodeChange = value => {
    setVerificationCode(value);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword: userLogin.newPassword || '',
      confirmedPassword: userLogin.confirmedPassword || '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required('Este campo es obligatorio')
        .min(5, 'La clave nueva debe tener al menos 5 caracteres'),
      confirmedPassword: Yup.string()
        .required('Este campo es obligatorio')
        .min(5, 'La confirmación debe tener al menos 5 caracteres'),
    }),
    onSubmit: values => {
      const user = {
        typeDocument: tipoDocumento,
        document: numDocumento,
        resetOTP: verificationCode,
        newPassword: values.newPassword,
      };
      // console.log('va a recoverPass', user);
      dispatch(recoverPass(user, navigate));
    },
  });

  // const isButtonDisabled =
  //   validation.values.document === '' || validation.values.password === '';

  const handleSubmit = async () => {
    if (verificationCode.length === 6) {
      setIsSubmitting(true);
      try {
        const user = {
          typeDocument: tipoDocumento,
          document: numDocumento,
          verificationCode: verificationCode,
        };
        console.log('llega en user', user);
        dispatch(validateOTP(user, navigate));
      } catch (error) {
        console.error('Error al validar el código:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isButtonDisabled = verificationCode.length !== 6;
  const isButtonDisabledPass = !(
    validation.values.newPassword &&
    validation.values.confirmedPassword &&
    validation.values.newPassword === validation.values.confirmedPassword
  );

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
                        {!validate && (
                          <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
                            <div>
                              <h3
                                className="text-center"
                                style={{ color: '#262626' }}
                              >
                                Recuperar Contraseña
                              </h3>

                              <p className="text-muted text-center mt-4 mb-5">
                                Te hemos enviado un mensaje de texto al teléfono
                                ***
                                {msgForgot} con un código de verificación. Por
                                favor, ingresa el código a continuación para
                                recuperar tu contraseña.
                              </p>
                            </div>
                            <VerificationInput
                              length={6}
                              onChange={handleCodeChange}
                              value={verificationCode}
                            />
                            <div className="mt-5">
                              <Button
                                color="primary"
                                className="btn btn-primary w-100"
                                onClick={handleSubmit}
                                disabled={isButtonDisabled || isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Spinner size="sm" className="me-2">
                                    {' '}
                                    Loading...{' '}
                                  </Spinner>
                                ) : null}
                                Continuar
                              </Button>
                            </div>
                          </div>
                        )}

                        {validate && (
                          <div className="mt-4">
                            <Form
                              onSubmit={e => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                              action="#"
                            >
                              {/* Label Clave Nueva */}
                              <div className="mb-4">
                                <h3
                                  className="text-center"
                                  style={{ color: '#262626' }}
                                >
                                  Recuperar Contraseña
                                </h3>
                                <p className="text-muted text-center">
                                  Escribe tu nueva clave de acceso. La clave
                                  debe tener mínimo 5 caracteres.
                                </p>
                                <Label
                                  className="form-label"
                                  htmlFor="password-input"
                                >
                                  Clave Nueva
                                </Label>
                                <div className="position-relative auth-pass-inputgroup mb-3">
                                  <Input
                                    style={{
                                      borderRadius: 0,
                                      border: 'none',
                                      borderBottom: '1px #690BC8 solid',
                                      backgroundImage: 'none',
                                    }}
                                    name="newPassword"
                                    value={validation.values.newPassword || ''}
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control pe-5"
                                    placeholder="Ingresa tu clave nueva"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.newPassword &&
                                      validation.errors.newPassword
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.newPassword &&
                                  validation.errors.newPassword ? (
                                    <FormFeedback
                                      type="invalid"
                                      style={{ marginTop: '10px' }}
                                    >
                                      {validation.errors.newPassword}
                                    </FormFeedback>
                                  ) : null}
                                  <button
                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    type="button"
                                    id="password-addon"
                                    style={{ padding: '0', marginTop: '5px' }}
                                  >
                                    {showPassword ? (
                                      <KUPIICONS.EyeOff />
                                    ) : (
                                      <KUPIICONS.Eye />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Label Confirmar Clave */}
                              <div className="mb-4">
                                <Label
                                  className="form-label"
                                  htmlFor="password-input"
                                >
                                  Confirmar Clave
                                </Label>
                                <div className="position-relative auth-pass-inputgroup mb-3">
                                  <Input
                                    style={{
                                      borderRadius: 0,
                                      border: 'none',
                                      borderBottom: '1px #690BC8 solid',
                                      backgroundImage: 'none',
                                    }}
                                    name="confirmedPassword"
                                    value={
                                      validation.values.confirmedPassword || ''
                                    }
                                    type={showPassword1 ? 'text' : 'password'}
                                    className="form-control pe-5"
                                    placeholder="Ingresa tu contraseña"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.confirmedPassword &&
                                      validation.errors.confirmedPassword
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.confirmedPassword &&
                                  validation.errors.confirmedPassword ? (
                                    <FormFeedback
                                      type="invalid"
                                      style={{ marginTop: '10px' }}
                                    >
                                      {validation.errors.confirmedPassword}
                                    </FormFeedback>
                                  ) : null}
                                  <button
                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                                    onClick={() =>
                                      setShowPassword1(!showPassword1)
                                    }
                                    type="button"
                                    id="password-addon"
                                    style={{ padding: '0', marginTop: '5px' }}
                                  >
                                    {showPassword1 ? (
                                      <KUPIICONS.EyeOff />
                                    ) : (
                                      <KUPIICONS.Eye />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Button Continuar */}
                              <div className="mt-5">
                                <Button
                                  color="primary"
                                  className="btn btn-primary w-100"
                                  type="submit"
                                  disabled={isButtonDisabledPass}
                                >
                                  {loading ? (
                                    <Spinner size="sm" className="me-2">
                                      {' '}
                                      Loading...{' '}
                                    </Spinner>
                                  ) : null}
                                  Continuar
                                </Button>
                              </div>
                            </Form>
                          </div>
                        )}
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

      <Modal
        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={'static'}
        id="staticBackdrop"
        centered
      >
        <ModalBody className="text-center p-5">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#121331,secondary:#08a88a"
            style={{ width: '120px', height: '120px' }}
          ></lord-icon>

          <div className="mt-4">
            <h4 className="mb-3">Cambio de contraseña exitosa</h4>
            <p className="text-muted mb-4">
              {' '}
              Se cambió correctamente la clave.
            </p>
            <div className="hstack gap-2 justify-content-center">
              {/* <Link
                to="#"
                className="btn btn-link link-success fw-medium"
                onClick={() => setmodal_backdrop(false)}
              >
                <i className="ri-close-line me-1 align-middle"></i> Close
              </Link> */}
              <Link
                to="#"
                className="btn btn-primary"
                onClick={() => {
                  setmodal_backdrop(false);
                  setTimeout(() => navigate('/login'), 300);
                }}
              >
                Aceptar
              </Link>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
