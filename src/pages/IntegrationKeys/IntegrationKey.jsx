import { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, 
  FormGroup, Label, Form, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { useSelector } from 'react-redux';
import { getTokensByCodEmpresaWS, createTokensWS, getTypeTokensWS } from '../../slices/integrationKeys/thunk';

import KUPIICONS      from '@/common/icons/icons';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../utilities';
import SearchableSelect from '@/Components/Common/select/searchableSelect';
import AlertKupi from '@/Components/Common/alertsNotification/alert';


import PaginationBar from '../../Components/Common/tables/paginationBar';
import Spinners from '@/Components/Common/Spinner';


export const _IntegrationKeysView = () => {

  // Extraer valores del selector
  const user = useSelector(state => state.Login.user);
  
  const [ codEmpresa, setCodEmpresa ] = useState('');
  const [ codEmpresaModal, setCodEmpresaModal ] = useState('');
  const [ selectedTypeToken, setSelectedTypeToken ] = useState('');
  const [ typeToken, setTypeToken ] = useState([]);
  const [ showToast, setShowToast ] = useState(toastDefault);
  const [ isModalOpen, setIsModalOpen ] = useState(false); 
  const [showAlert, setShowAlert] = useState({ title: "", message: "", isVisible: false });


  // Manejador de la tabla
  const [loading, setLoading] = useState(false);
  const [dataReport, setDataReport] = useState([]);
  const [ isSearching, setIsSearching ] = useState(false);
  // const [_searchingToken, setSearchingCategory] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 25;

  const _showToast = (title, message, type = 'success') => { setShowToast({ title, message, type, isVisible: true })};

  useEffect(() => {
    getTypeTokens();
  }, [])


  // Maneja la búsqueda de las llaves de integración
  const getTokensByCompany = async () => {

    try {

      setIsSearching(true);
      setLoading(true);

      const dataRequest = {
        params: codEmpresa
      } 

      const { data } = await getTokensByCodEmpresaWS(dataRequest)
      
      setDataReport(data);
      
    } catch (err) {
      setDataReport([]);
      console.error('Error:', err);
      const jsonString = JSON.stringify(err.data.message, null, 2);
      _showToast(`Error ${err?.status || 'desconocido'}`, jsonString, "danger");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }

  }


  const getTypeTokens = async () => {
    try {
      const { data } = await getTypeTokensWS();

      // Verificamos que data sea un array antes de mapearlo
      if (Array.isArray(data)) {
        const typesToken = data.map(token => ({
          codTipo: token.codTipo,
          nomTipo: token.nomTipo
        }));
        setTypeToken(typesToken);
      } else {
        console.error('Error: La respuesta de getTypeTokensWS no es un array')
      }

    } catch (error) {
      console.error('Error fetching types token:', error)
    }
  }


  // Maneja los cambios del input principal para codEmpresa
  const handleInputChange = (e) => {
    setCodEmpresa(e.target.value)
  }
  
  // Maneja los cambios del input para codEmpresa en el modal
  const handleModalInputChange = (e) => {
    setCodEmpresaModal(e.target.value)
  }


  const handleSearch = async (e) => {
    e.preventDefault();
    await getTokensByCompany();
  }

  
  // Se ejecuta después de dar al botón Buscar
  const handleSearchTokens = () => {

    // Valida que el codEmpresa no tenga caracteres especiales
    if (!/^\d+$/.test(codEmpresa)) {
      setShowToast({
        title: "Error",
        message: "El código de empresa debe ser numérico.",
        type: "danger",
        isVisible: true,
      });
      return;
    }

    setShowToast({
      title  : "Procesando...",  
      message: "Por favor espere",
      type   : "info",  
      isVisible: true
    });

    getTokensByCompany();
  }


  // Maneja la selección del tipo de token en el select del modal 
  const handleTypeTokenChange = (selectedOption) => {

    
    if(!selectedOption) {
      console.error('Valor de tipo de token no válido', selectedOption)
      return;
    }
    const [codTipo, nomTipo] = selectedOption.split('-');
    setSelectedTypeToken({codTipo, nomTipo});
  }


  const saveTokens = async () => {
    
    try {

      const data = {
        token: user.token,
        bodyOptions: {
          codEmpresa: codEmpresaModal,
          codTipo: selectedTypeToken.codTipo
        }
      };

      const response = await createTokensWS(data)
      
      // Verifica si las llaves ya existen en la BD
      if (response?.data?.status === false && response?.data?.message) {
        setShowToast({
          title: "Llaves ya existentes",
          message: response.data.message,
          type: "warning",
          isVisible: true,
        });
      } else {
        setShowToast({
          title: "Llave creada exitosamente",
          message: "La llave de integración ha sido creada.",
          type: "success",
          isVisible: true,
        });
      }

      toggleModal();

    } catch (err) {
      setShowAlert({ 
        title: " Error" + err.status, 
        message: JSON.stringify(err.data.message || "Ocurrió un error inesperado", null, 2), 
        isVisible: true })

    }
  }

  // constantes internas
  const toggleModal = (token = null) => {
    setCodEmpresa(token?.codEmpresa || '');
    setIsModalOpen(!isModalOpen);
  };


  const filteredTokens = dataReport.filter((token) => 
    String(token.codEmpresa || '').includes(codEmpresa) || 
    String(token.codUsuario || '').includes(codEmpresa)
  );
  

  const currentItems = filteredTokens.slice(
    pageIndex * pageSize, 
    (pageIndex + 1) * pageSize
  );


  const listTokensHeader = () => (
    <Row className='justify-content-center'>
      <Col xl={4}>
        <Card className='bodyTable'>
          <CardHeader>
            <h2 className="d-flex align-items-center card-title mb-0 fw-bold">
              <strong className='text-primary' style={{fontSize: "25px"}}> l </strong> Llaves de Integración
            </h2>
          </CardHeader>
          <CardBody>
            <Form className="d-flex justify-content-between align-items-center" onSubmit={handleSearch}>
              <FormGroup>
                <Label for="codEmpresa" className='fw-bold'>Código de empresa</Label>
                <Input
                  style={{
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: '1px #690BC8 solid',
                  }}
                  type="text"
                  name="codEmpresa"
                  id="codEmpresa"
                  value={codEmpresa}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <Button
                type="button"
                onClick={handleSearchTokens}
                style={{
                  backgroundColor: "#690BC8",
                  borderColor: '#690BC8',
                  marginRight: '20px'
                }}
                disabled={isSearching}
              >
                {isSearching ? <Spinners /> : "Buscar"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );


  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>Empresa</th>
          <th>Tipo</th>
          <th>Public Key</th>
          <th>API Key</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {}
        {currentItems.map((token, index) => (
          <tr key={index}>
            <td>{ token?.codEmpresa}</td>
            <td>{ token?.nomTipo}</td>
            <td>{ token?.publicKey }</td>
            <td>{ token?.apiKey}</td>
          </tr>
        ))}
      </tbody>
    );
  }


  const typesTokensOptions = Array.isArray(typeToken) ? typeToken.map(token => ({
    value: `${token.codTipo}-${token.nomTipo}`,
    label: `${token.codTipo}-${token.nomTipo}`,
  })) : [];

  function _modalAgregar() {
    return(
    <Modal isOpen={isModalOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal} className='fw-bold'> Agregar App
      </ModalHeader>
      <ModalBody>
        <Form className='row'>
          <FormGroup className='col-12 px-4'>
            <Label for="codEmpresa">codEmpresa</Label>
            <Input
              type="text"
              name="codEmpresa"
              id="codEmpresa"
              placeholder='Agregar codEmpresa'
              value={codEmpresaModal}
              onChange={handleModalInputChange}
            />
          </FormGroup>
          <FormGroup className='col-12'>
            {typeToken.length > 0 ? (
              <SearchableSelect
                title="Tipo de Llave"
                options={typesTokensOptions}
                placeholder="Selecciona un tipo de llave..."
                onChange={handleTypeTokenChange}
                selectedValue={selectedTypeToken ? `${selectedTypeToken}-${typeToken.nomTipo}` : ''}
              />
            ) : (
              <p>Cargando tipos de token...</p>
            )}
          </FormGroup>
        </Form>
        <div className='mt-2 mb-2'>
          <AlertKupi 
            title     = { showAlert.title}
            message   = { showAlert.message}
            isVisible = { showAlert.isVisible}
            onClose   = { () => setShowAlert({ title: "", message: "", type: "success", isVisible: false })}     
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button 
          color="" 
          onClick={toggleModal}
          style={{ 
            backgroundColor: '#DDF580', 
          }}>
          Cancelar
        </Button>
        <Button 
        onClick={saveTokens}
        color="primary"
        disabled={!codEmpresaModal || !selectedTypeToken.codTipo}
        >
        Agregar
        </Button>{' '}
      </ModalFooter>
    </Modal>
    );
  }

  const _tableListTokens = () => {
    return (
      <div className='m-2'>
        { loading && <Spinners/> }
        { !loading && dataReport.length > 0 && (
          <table className="table align-middle table-nowrap" id="tokensTable">
            {_tableTittles()}
            {_tableBody()}
            </table>
        )}
        
        {!loading && dataReport.length === 0 && ( // Muestra un mensaje si no hay datos
          <p>No se encontraron llaves de integración para la empresa ingresada.</p>
        )}

        {
          filteredTokens.length > 0 && 
          <PaginationBar
            totalItems={filteredTokens.length}
            itemsPerPage={pageSize}
            currentPage={pageIndex + 1}
            onPageChange={(page) => {
              setPageIndex(page - 1);
            }}
          />
        }
        </div>
    );
  }


  return (
    <>
    <Container fluid>
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title: "", message: "", type: "success", isVisible: false })}
      />
      {listTokensHeader()}
      {dataReport.length > 0 && (
        <Card className='bodyTable p-2'>
          {_modalAgregar()}
          <Button 
            color="primary"
            className="rounded-pill fw-bold btnAdd" 
            onClick={() => toggleModal()}
          >
            <KUPIICONS.Plus />
          </Button>
          {_tableListTokens()}
        </Card>
      )}
    </Container>
    
    </>
  );
}