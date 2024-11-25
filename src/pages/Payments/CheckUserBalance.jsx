import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDocumentTypesWS, notificateBalanceUserWS } from '../../slices/users/thunk';
import { Card, CardBody, CardHeader, Col, Container, Row, Button, Form, FormGroup, Label, Input  } from 'reactstrap';


import SearchableSelectDecoration from '@/Components/Common/select/searchableSelect';
import './style/index.scss';
import Swal from 'sweetalert2';

export const CheckUserBalance = () => {

  const user = useSelector(state => state.Login.user);


  const [typeDocuments, setTypeDocuments] = useState([])
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');


  useEffect(() => {
    getDocumentTypes()
  }, [user])

  // Obtiene los tipos de documento
  const getDocumentTypes = async () => {
    try{

      const { data } = await getDocumentTypesWS();

      setTypeDocuments(data)
      console.log("lo que llega a la api", data)

    } catch (error) {
      console.error('Error fetching typesDocuments:', error)

    }
  }

  const handleInputChange = (e) => {
    const [codTipo, nomTipo, nomCompleto] = e.split('-');

    setSelectedDocumentType({ codTipo, nomTipo, nomCompleto })
  }
  
  const handleInputChangeDocument = (e) => {

    setDocumentNumber(e.target.value)
  }


  const typesDocumentsOptions = typeDocuments.map((documents) => ({
    value: `${documents.codTipo}-${documents.nomTipo}-${documents.nomCompleto}`,
    label: `${documents.nomTipo}-${documents.nomCompleto}`,
  }))


  // Extrae el codEmpresa del localStorage
  const getCodEmpresa = () => {
    const user = localStorage.getItem('user'); // Obtén el valor desde el localStorage
    if (user) {
      const parsedAuthUser = JSON.parse(user); // Parsear el JSON
      return parsedAuthUser.codEmpresa; // Extraer el codEmpresa
    }
    console.log("user", user)
    return null;
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const codEmpresa = getCodEmpresa();

    if(!selectedDocumentType || !documentNumber) {

      await Swal.fire({
        title: 'Datos incompletos',
        text: 'Por favor, seleccione un tipo de documento y agregue un número de documento',
        icon: 'error',
        confirmButtonText: 'Continuar',
        timer: 3000
      });

      return;

    }

    const token = JSON.parse(localStorage.getItem('user')).token;

    const dataToSend = {
      codEmpresa,
      tipoDocumento: selectedDocumentType.codTipo,
      numDocumento: documentNumber
    }

    try {
      await notificateBalanceUserWS(token, dataToSend);
      setDocumentNumber('');
      setSelectedDocumentType(null)

      await Swal.fire({
        title: 'Consulta exitosa',
        text: 'Mensaje enviado correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 3000
      });
      window.location.reload();

    } catch (error) {
      console.error("Error al enviar datos:", error);
      const { response } = error;
      const jsonString = JSON.stringify(response.data, null, 2);

      await Swal.fire({
        title: `Error ${response?.status || 'desconocido'}`,
        text: jsonString,
        icon: 'error',
        confirmButtonText: 'Continuar',
        timer: 3000
      });

    }

  }

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={6}>
            <Card className="bodyTable">
              <CardHeader>
                <h2 className="card-title mb-0 fw-bold">Saldo usuario</h2>
              </CardHeader>
              <CardBody className='p-4'>
                <Form className='row' onSubmit={handleSubmit}>
                  <FormGroup>
                    <SearchableSelectDecoration
                      title="Tipo de documento"
                      options={typesDocumentsOptions}
                      placeholder="Seleccione un tipo de documento..."
                      onChange={handleInputChange}
                      selectedValue={selectedDocumentType ? `${selectedDocumentType.codTipo}-${selectedDocumentType.nomTipo}-${selectedDocumentType.nomCompleto}` : ''}
                    />
                  </FormGroup>
                  <FormGroup>
                    <div className='px-3'>
                    <Label for="numDocumento" className='mt-3 fw-bold'>Número de documento</Label>
                      <Input
                      style={{
                        borderRadius: 0,
                        border: 'none',
                        borderBottom: '1px #690BC8 solid',
                      }}
                        type="text"
                        name="numDocumento"
                        id="numDocumento"
                        placeholder='Agregue la referencia del pago.'
                        value= {documentNumber}
                        onChange= {handleInputChangeDocument}
                      />
                    </div>
                      
                  </FormGroup>
                  <div className="col-12 d-flex justify-content-end mt-3">
                    <Button
                      type="submit"
                      scolor="primary"
                    >
                      Enviar
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