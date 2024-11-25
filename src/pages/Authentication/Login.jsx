import * as Yup              from 'yup';
import * as Rts              from 'reactstrap';
import { useEffect, useState }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { loginApp } from '@/slices/thunks';
import { resetLogin } from '@/slices/auth/login/reducer';
import imgKupi from '@/assets/images/loginKupi.webp';
import KUPIICONS  from '@/common/icons/icons';


export const Login = () => {

  document.title = 'Sign-In | Kupi';
  // Manipulador de navegación
  const navigate = useNavigate();
  // Manipulador de Estado
  const dispatch = useDispatch();
  // States
  const [userLogin]                     = useState({ document: '',  password: '', typeDocument: '2' });
  const [showPassword, setShowPassword] = useState(false);
  // Traer la info del state
  const { loading, errorMsg } = useSelector(state => state.Login);

  // Validaciones del formularion
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      document    : userLogin.document,
      password    : userLogin.password,
      typeDocument: userLogin.typeDocument || '2', // Asegúrate de que esto esté aquí
    },
    validationSchema: Yup.object({
      typeDocument: Yup.string().required( 'Debes seleccionar un tipo de documento' ),
      document: Yup.string()
        .required('Este campo es obligatorio')
        .matches(/^\d+$/, 'Solo se permiten números')
        .min(7, 'El número de documento debe tener al menos 7 dígitos'),
      password: Yup.string().required('Este campo es obligatorio'),
    }),
    onSubmit: values => {
      dispatch(loginApp(values, navigate));
    },
  });

  useEffect(() => {
    validation.document
  }, [])
  

  // Deshabilitar el btn
  const isButtonDisabled = validation.values.document === '' || validation.values.password === '';

  const onDismiss = () => {
    dispatch(resetLogin());
  };

  return (
    <>
      <div className="auth-page-wrapper auth-bg-cover py-3 d-flex justify-content-center align-items-center min-vh-100">
        <div
          style={{ position: 'absolute', left: '50%', top: 20, transform: 'translateX(-50%)', }}
          className="d-lg-none"
        >
          <KUPIICONS.LogoKupi />
        </div>

        <div
          style={{ position: 'absolute', left: 20, top: 16, }}
          className="d-none d-lg-block"
        >
          <KUPIICONS.LogoKupi />
        </div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Rts.Container>
            <Rts.Row>
              <Rts.Col lg={12}>
                <Rts.Card className="overflow-hidden">
                  <Rts.Row className="g-0">
                    <Rts.Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h3
                            className="text-center"
                            style={{ color: '#262626' }}
                          >
                            ¡ Bienvenido a{' '}
                            <span style={{ fontWeight: 'bold' }}>Kupi</span> !
                          </h3>
                          <p className="text-muted text-center">
                            Ingresa tu número de documento y contraseña para
                            ingresar a la plataforma.
                          </p>
                        </div>

                        <Rts.Alert
                          color="danger"
                          className="d-flex justify-content-between align-items-center"
                          isOpen={errorMsg}
                        >
                          <span className="text-black">
                            La contraseña o número de documento ingresado, no
                            coinciden con la registrada.
                          </span>
                          <button
                            onClick={onDismiss}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#690BC8',
                            }}
                            aria-label="Close"
                          >
                            <KUPIICONS.Close />
                          </button>
                        </Rts.Alert>

                        <div className="mt-4">
                          <Rts.Form
                            onSubmit={e => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                            }}
                            action="#"
                          >
                            <div className="mb-4">
                              <Rts.Label htmlFor="typeDocument" className="form-label">
                                Tipo de documento
                              </Rts.Label>

                              <select
                                name="typeDocument"
                                value={validation.values.typeDocument || '2'} // Asegúrate de que el valor inicial esté definido
                                style={{
                                  borderRadius: 0,
                                  border: 'none',
                                  borderBottom: '1px #690BC8 solid',
                                  backgroundImage: 'none',
                                }}
                                className={`form-select mb-3 text-muted ${
                                  validation.touched.typeDocument && validation.errors.typeDocument ? 'is-invalid' : ''
                                }`}
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

                              {validation.touched.typeDocument && validation.errors.typeDocument ? (
                                <Rts.FormFeedback
                                  type="invalid"
                                  style={{
                                    marginTop: '0',
                                  }}
                                >
                                  {validation.errors.typeDocument}
                                </Rts.FormFeedback>
                              ) : null}
                            </div>


                            <div className="mb-4">
                              <Rts.Label htmlFor="email" className="form-label">
                                No. de documento
                              </Rts.Label>
                              <Rts.Input
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
                                <Rts.FormFeedback
                                  type="invalid"
                                  style={{ marginTop: '10px' }}
                                >
                                  {validation.errors.document}
                                </Rts.FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-4">
                              <Rts.Label
                                className="form-label"
                                htmlFor="password-input"
                              >
                                Contraseña
                              </Rts.Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Rts.Input
                                  style={{
                                    borderRadius: 0,
                                    border: 'none',
                                    borderBottom: '1px #690BC8 solid',
                                    backgroundImage: 'none',
                                  }}
                                  name="password"
                                  value={validation.values.password || ''}
                                  type={showPassword ? 'text' : 'password'}
                                  className="form-control pe-5"
                                  placeholder="Ingresa tu contraseña"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.password &&
                                    validation.errors.password
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.password &&
                                validation.errors.password ? (
                                  <Rts.FormFeedback
                                    type="invalid"
                                    style={{ marginTop: '10px' }}
                                  >
                                    {validation.errors.password}
                                  </Rts.FormFeedback>
                                ) : null}
                                <button
                                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none"
                                  onClick={() => setShowPassword(!showPassword)}
                                  type="button"
                                  id="password-addon"
                                  style={{ padding: '0', marginTop: '5px' }}
                                >
                                  {showPassword ? <KUPIICONS.EyeOff /> : <KUPIICONS.Eye />}
                                </button>
                              </div>
                            </div>
                            <div className="mt-5">
                              <Rts.Button
                                color="primary"
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={isButtonDisabled}
                              >
                                {loading ? (
                                  <Rts.Spinner size="sm" className="me-2">
                                    {' '}
                                    Loading...{' '}
                                  </Rts.Spinner>
                                ) : null}
                                Ingresar
                              </Rts.Button>
                            </div>
                            <div className="text-center mt-3">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                ¿Olvidaste tu contraseña?
                              </Link>
                            </div>
                          </Rts.Form>
                        </div>
                      </div>
                    </Rts.Col>
                    <Rts.Col lg={6} className="d-none d-lg-block">
                      <img src={imgKupi} alt="" height="600" />
                    </Rts.Col>
                  </Rts.Row>
                </Rts.Card>
              </Rts.Col>
            </Rts.Row>
          </Rts.Container>
        </div>
      </div>
    </>
  );
};
