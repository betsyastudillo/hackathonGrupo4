/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Card, CardBody, CardHeader, Col, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'
// Estilos
import '@/pages/Users/UserProfile/styles/index.scss';

import { getCitiesWithDeptoWS } from '@/slices/locations/thunk';
import { findUserByIdtWS, updateProfile, changePassword } from '@/slices/users/thunk';
import SearchableSelect from '../../../Components/Common/select/searchableSelect';
import Swal from 'sweetalert2';

import { defaultUser } from '@/utilities';
import { parseDate } from '../../../utilities';

export const _FormProfileUser = ({ id, readOnly }) => {
  const user = useSelector(state => state.Login.user);

  const [cities, setCities] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [_fetchedUser, setFetchUser] = useState(defaultUser);

  const [genero, setGenero] = useState();
  const [ciudad, setCiudad] = useState();
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());

  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirmNew, setPasswordConfirmNew] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    _getInformation();
  }, [user]);

  const _getInformation = async () => {
    try {
      await Promise.all([findUserByID(), getCities()]);
    } catch (error) {
      console.error('Error fetching information:', error);
    } finally {
      setLoading(!_loading);
    }
  };

  const findUserByID = async () => {
    try {
      const { data } = await findUserByIdtWS(user.token, id);
      setFetchUser(data);
      setGenero(data.codGenero.toString());
      setCiudad(data.codCiudad);
      setFechaNacimiento(parseDate(data.fecNacimiento));
      console.log('data -> ', data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  };

  const getCities = async () => {
    try {
      const { data } = await getCitiesWithDeptoWS();
      const citiesOptions = data.map(city => ({
        value: city.codCiudad,
        label: city.nomCiudad + ' (' + city.nomDepto + ')',
      }));
      setCities(citiesOptions);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const updateUser = async () => {
    try {
      await updateProfile(
        user.token,
        genero.toString(),
        ciudad.toString(),
        fechaNacimiento
      );
      await Swal.fire({
        title: 'Actualización',
        text: 'Datos actualizados exitosamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 3000,
      });
      window.location.reload();
    } catch (err) {
      await Swal.fire({
        title: 'Actualización',
        text: 'Ha ocurrido un error al actualizar los datos\n' + err,
        icon: 'error',
        confirmButtonText: 'Continuar',
        timer: 3000,
      });
      console.error('Error updating profile:', err);
    }
  };

  const changePasswordUser = async () => {
    if (passwordNew !== passwordConfirmNew) {
      setError('Las claves no coinciden.');
      return;
    }
    try {
      setError(null);
      await changePassword(user.token, passwordOld, passwordNew);
      await Swal.fire({
        title: 'Actualización',
        text: 'Contraseña actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 3000,
      });
      window.location.reload();
    } catch (error) {
      await Swal.fire({
        title: 'Actualización',
        text: 'Hubo un error al cambiar la contraseña. Inténtelo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Continuar',
        // timer: 3000
      });
      // setError('Hubo un error al cambiar la contraseña. Inténtelo de nuevo.');
    }
  };

  const cardDatosPersonales = (
    <Row className="mb-5">
      <Card className="mt-xxl-n5">
        <CardHeader>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="card-title mb-0">Datos personales</h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <Form>
            <Row>
              <Col lg={4}>
                <div className="mb-3">
                  <Label htmlFor="cedulaInput" className="form-label">
                    Cédula
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="cedulaInput"
                    readOnly
                    defaultValue={_fetchedUser.numDocumento}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <Label htmlFor="telefonoINput" className="form-label">
                    Teléfono de Notificaciones
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="telefonoINput"
                    readOnly
                    defaultValue={_fetchedUser.telUsuario}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <Label htmlFor="correoInput" className="form-label">
                    Correo electrónico
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="correoInput"
                    readOnly
                    defaultValue={_fetchedUser.emaUsuario}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Row>
  );

  const cardDatosModificables = (
    <Row className="mb-5">
      <Card className="mt-xxl-n5">
        <CardHeader>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="card-title mb-0">Editar información</h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className="bodyCardEditable">
          <Form>
            <Row className="mb-3">
              <Col lg={4}>
                <div style={{ padding: '1.25rem 1rem 0 1rem' }}>
                  <Label htmlFor="dateInput" className="form-label">
                    Fecha de nacimiento
                  </Label>
                  <Flatpickr
                    className="form-control"
                    value={fechaNacimiento}
                    onChange={date => {
                      const formattedDate = date[0]
                        ?.toISOString()
                        .split('T')[0];
                      setFechaNacimiento(formattedDate);
                    }}
                    options={{
                      locale: Spanish,
                      dateFormat: 'd M, Y',
                      clickOpens: !readOnly,
                    }}
                    readOnly={readOnly}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <SearchableSelect
                  title="Género"
                  options={[
                    { value: '0', label: 'Masculino' },
                    { value: '1', label: 'Femenino' },
                    { value: '2', label: 'Sin definir' },
                  ]}
                  placeholder="Selecciona género..."
                  onChange={value => setGenero(value)}
                  readOnly={readOnly}
                  selectedValue={genero}
                />
              </Col>
              <Col lg={4}>
                <SearchableSelect
                  title="Ciudad"
                  options={cities}
                  placeholder="Seleccionar ciudad..."
                  onChange={value => setCiudad(value)}
                  readOnly={readOnly}
                  selectedValue={ciudad}
                />
              </Col>
            </Row>
            {!readOnly && (
              <div className="text-end">
                <button onClick={updateUser} className="btn btn-primary">
                  Actualizar
                </button>
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    </Row>
  );

  const cardCambiarClave = (
    <Row className="mb-5">
      <Card className="mt-xxl-n5">
        <CardHeader>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="card-title mb-0">Cambiar clave</h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <Form>
            <Row>
              <Col lg={4}>
                <div className="mb-3">
                  <Label htmlFor="passwordOldInput" className="form-label">
                    Clave actual
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="passwordOldInput"
                    placeholder="Ingrese su contraseña actual"
                    onChange={e => setPasswordOld(e.target.value)}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <Label htmlFor="passwordNewInput" className="form-label">
                    Nueva clave
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="passwordNewInput"
                    placeholder="Ingrese su nueva contraseña"
                    onChange={e => setPasswordNew(e.target.value)}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <Label
                    htmlFor="passwordConfirmNewInput"
                    className="form-label"
                  >
                    Confirmar clave
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="passwordConfirmNewInput"
                    placeholder="Confirme la nueva contraseña"
                    onChange={e => setPasswordConfirmNew(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
            {error && <p className="text-danger">{error}</p>}
            <div className="text-end">
              <button className="btn btn-primary" onClick={changePasswordUser}>
                Cambiar clave
              </button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Row>
  );

  return (
    <>
      {cardDatosPersonales}
      {cardDatosModificables}
      {!readOnly && cardCambiarClave}
    </>
  );
};

export default _FormProfileUser;
