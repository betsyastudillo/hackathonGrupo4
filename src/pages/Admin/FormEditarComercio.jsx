// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Col, Form, Input, Label, Row } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getDetailsCompany, updateCommerce } from '@/slices/thunks';

export const FormEditarComercio = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.Login);
  const idCompany = user.codEmpresa;
  // console.log('llega de user', user);
  const { detailsCompany } = useSelector(state => state.Companies);

  const [formValues, setFormValues] = useState({
    nomEmpresa: '',
    dirEmpresa: '',
    desEmpresa: '',
    emaEmpresa: '',
    telPrincipal: '',
    telEmpresa: '',
    palClaves: '',
    whatsapp: '',
    urlWeb: '',
    urlImagen: '',
    urlComprar: '',
  });

  useEffect(() => {
    if (idCompany) {
      dispatch(getDetailsCompany(idCompany));
    }
  }, [dispatch, idCompany]);

  useEffect(() => {
    if (detailsCompany) {
      setFormValues({
        nomEmpresa: detailsCompany.nomEmpresa || '',
        dirEmpresa: detailsCompany.dirEmpresa || '',
        desEmpresa: detailsCompany.desEmpresa || '',
        emaEmpresa: detailsCompany.emaEmpresa || '',
        telPrincipal: detailsCompany.telPrincipal || '',
        telEmpresa: detailsCompany.telEmpresa || '',
        palClaves: detailsCompany.palClaves || '',
        whatsapp: detailsCompany.whatsapp || '',
        urlWeb: detailsCompany.urlWeb || '',
        urlImagen: detailsCompany.urlImagen || '',
        urlComprar: detailsCompany.urlComprar || '',
      });
    }
  }, [detailsCompany]);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    const commerceData = {
      nomEmpresa: formValues.nomEmpresa,
      dirEmpresa: formValues.dirEmpresa,
      desEmpresa: formValues.desEmpresa,
      emaEmpresa: formValues.emaEmpresa,
      telPrincipal: formValues.telPrincipal,
      telEmpresa: formValues.telEmpresa,
      palClaves: formValues.palClaves,
      whatsapp: formValues.whatsapp,
      urlWeb: formValues.urlWeb,
      urlImagen: formValues.urlImagen,
      urlComprar: formValues.urlComprar,
    };

    try {
      await dispatch(updateCommerce(idCompany, commerceData));
      window.location.reload();
    } catch (error) {
      console.log('Error al actualizar el comercio:', error);
    }
  };

  return (
    <>
      <Form>
        <Row>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="nomEmpresa" className="form-label">
                Nombre
              </Label>
              <Input
                type="text"
                className="form-control"
                id="nomEmpresa"
                placeholder="Nombre de la Empresa"
                value={formValues.nomEmpresa}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="dirEmpresa" className="form-label">
                Dirección
              </Label>
              <Input
                type="text"
                className="form-control"
                id="dirEmpresa"
                placeholder="Dirección"
                value={formValues.dirEmpresa}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="telPrincipal" className="form-label">
                Teléfono Principal
              </Label>
              <Input
                type="text"
                className="form-control"
                id="telPrincipal"
                placeholder="Teléfono Principal"
                value={formValues.telPrincipal}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="telEmpresa" className="form-label">
                Teléfono Empresa
              </Label>
              <Input
                type="text"
                className="form-control"
                id="telEmpresa"
                placeholder="Teléfono Principal"
                value={formValues.telEmpresa}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="whatsapp" className="form-label">
                Whatsapp
              </Label>
              <Input
                type="text"
                className="form-control"
                id="whatsapp"
                placeholder="Whatsapp"
                value={formValues.whatsapp}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="emaEmpresa" className="form-label">
                Email
              </Label>
              <Input
                type="text"
                className="form-control"
                id="emaEmpresa"
                placeholder="Designation"
                value={formValues.emaEmpresa}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="urlWeb" className="form-label">
                Página Web
              </Label>
              <Input
                type="text"
                className="form-control"
                id="urlWeb"
                placeholder="www.example.com"
                value={formValues.urlWeb}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="urlComprar" className="form-label">
                E-commerce
              </Label>
              <Input
                type="text"
                className="form-control"
                id="urlComprar"
                placeholder="www.example.com"
                value={formValues.urlComprar}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="mb-3">
              <Label htmlFor="urlImagen" className="form-label">
                URL Imágen
              </Label>
              <Input
                type="text"
                className="form-control"
                id="urlImagen"
                placeholder="Descripción de la empresa"
                value={formValues.urlImagen}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="mb-3">
              <Label htmlFor="desEmpresa" className="form-label">
                Descripción / Slogan
              </Label>
              <Input
                type="text"
                className="form-control"
                id="desEmpresa"
                placeholder="Descripción de la empresa"
                value={formValues.desEmpresa}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="mb-3">
              <Label htmlFor="palClaves" className="form-label">
                Palabras Clave
              </Label>
              <Input
                type="text"
                className="form-control"
                id="palClaves"
                placeholder="Palabras clave, Tags"
                value={formValues.palClaves}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={12}>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-soft-success"
                onClick={() => setFormValues(detailsCompany)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Actualizar
              </button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};
