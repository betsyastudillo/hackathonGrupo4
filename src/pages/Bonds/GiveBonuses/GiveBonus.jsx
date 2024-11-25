import { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row, Button, CardHeader, Input, 
  FormGroup, Label, Form } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLatestBondsWS, getInfoUserWS} from '../../../slices/bonds/thunk';

import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { formatSaldoCOP, toastDefault } from '../../../utilities';

import Spinners from '@/Components/Common/Spinner';

export const _GiveBonusView = () => {

  const navigate = useNavigate();

  const { user } = useSelector(state => state.Login);
  const codFinanciadora = user.codEmpresa
  
  const [ numDocumento, setNumDocumento ] = useState('');
  const [ isSearching, setIsSearching ] = useState(false);
  const [ bonds, setBonds ] = useState([]);
  const [ loading, setLoading ] = useState([]);
  const [ error, setError ] = useState([]);
  const [ showToast, setShowToast ] = useState(toastDefault);


  useEffect(() => {
    if (codFinanciadora){ 
      getLatestBonds();
    }
  }, [codFinanciadora])


  const getLatestBonds = async () => {

    setLoading(true);
    setError(null);

    try {
      const dataRequest = {
        params: codFinanciadora
      } 

      const data = await getLatestBondsWS(dataRequest);

      // Verifica que data sea un array antes de actualizar el estado
      if (Array.isArray(data.data)) {
        setBonds(data.data);
      } else {
        console.error("Los datos de bonos no son un array:", data);
        setBonds([]); // Vacía el array en caso de que no se reciba un array
      }

    } catch (error) {
      console.error('Error fetching types token:', error);
      setError("Error al cargar los datos de bonos. Inténtalo de nuevo más tarde.");
      setBonds([]);
    } finally {
      setLoading(false);
    }
  }


  const handleInputChange = (e) => {
    const { value } = e.target;
    setNumDocumento(value);
  };


  const handleSearch = async (e) => {
    e.preventDefault();

    // Validación: verifica si numDocumento está vacío
    if (!numDocumento.trim()) {
      console.error("Número de documento vacío o inválido");
      return; // No se realiza la búsqueda si el campo está vacío
    }

    setIsSearching(true);

    try {

      const dataRequest = {
        params: numDocumento
      } 
      const response = await getInfoUserWS(dataRequest)
      
      if (response.status) {
        const documento = response.data?.numDocumento
        navigate(`/asignar-bono/${documento}`)
      }
      
    } catch (error) {
      console.error("Error al buscar el usuario", error);

      setShowToast({
        title: "El usuario no se encontró",
        message: "Será redireccionado para su creación.",
        type: "danger",
        isVisible: true
      });

      setTimeout(() => {
        navigate(`/crear-usuario-financier`);
      }, 3000); 

    } finally {
      setIsSearching(false);
    }
  }


  const giveBonusHeader = () => (
    <Row className='justify-content-center'>
      <Col xl={4}>
        <Card className='bodyTable'>
          <CardHeader>
            <h2 className="d-flex align-items-center card-title mb-0 fw-bold">
              <strong className='text-primary' style={{fontSize: "25px"}}> l </strong> Buscar Usuario
            </h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSearch}>
              <FormGroup>
                <Label for="numDocumento" className='fw-bold'>Número de cédula del beneficiario del bono</Label>
                <Input
                  style={{
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: '1px #690BC8 solid',
                  }}
                  type="text"
                  name="numDocumento"
                  id="numDocumento"
                  value={numDocumento}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <div className="col-12 d-flex justify-content-end mt-3">
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSearching}
                >
                  {isSearching ? <Spinners /> : "Buscar"}
                </Button>
              </div>
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
          <th>ID</th>
          <th>Fecha</th>
          <th>Tipo de Bono</th>
          <th>Nombre Bono</th>
          <th>Beneficiario</th>
          <th>Usr Asigna</th>
          <th>Observación</th>
          <th>Valor</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {}
        {bonds.map((bond, index) => (
          <tr key={index}>
            <td>{ bond?.numBono}</td>
            <td>{ bond?.fecTransaccion}</td>
            <td>{ bond?.tipoBono }</td>
            <td>{ bond?.nomBono }</td>
            <td>{ bond?.nomRecibe} {bond?.apeRecibe}</td>
            <td>{ bond?.nomAsigna} {bond?.apeAsigna}</td>
            <td>{ bond?.obsBono}</td>
            <td className='text-end'>{ formatSaldoCOP (bond?.valBono)}</td>
          </tr>
        ))}
      </tbody>
    );
  }


  const _tableListBeneficiaries = () => {
    return (
      <div className='m-2'>
        <h5 className='table-title fw-bold mb-3'
          >Últimos bonos enviados</h5>
        <table className="table align-middle table-nowrap" id="tokensTable">
          {_tableTittles()}
          {_tableBody()}
        </table>
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
      {giveBonusHeader()}
      <Card className='bodyTable p-2'>
        {loading ? (
          <div className="d-flex justify-content-center p-4">
            <Spinners /> {/* Muestra el spinner mientras carga */}
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p> // Mensaje de error si falla la carga
        ) : (
          _tableListBeneficiaries()
        )}
      </Card>
    </Container>
    
    </>
  );
}