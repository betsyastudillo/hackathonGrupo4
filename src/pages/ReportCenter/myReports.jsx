/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { Container,Form, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import KUPIICONS from '../../common/icons/icons';
import { useSelector } from 'react-redux';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import SearchableSelect from '../../Components/Common/select/searchableSelect';
import MyReportsView  from './components/Reports';

import { getReportsbyCodPerfilWS } from '../../slices/reports/thunk';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import { parseDate } from '../../utilities';

export const _myReportsView = () => {

  const today = new Date().toISOString().split("T")[0];
  const user = useSelector(state => state.Login.user);
  
  const [startDate, setStartDate]         = useState(parseDate(today));
  const [endDate, setEndDate]             = useState(parseDate(today));
  const [selectedReport, setSelectedReport] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showToast, setShowToast] = useState({ title: "", message: "", type: "success", isVisible: false });
  const [searchTrigger, setSearchTrigger] = useState(0);  // Estado para disparar la búsqueda
  const [reportsOptions, setReportOptions] = useState( []);

  useEffect(() => {
    if ( user.codPerfil ) _handlerGetReports();
  }, [user])

  const _showToast = (title, message, type = 'success') => {
    setShowToast({ title, message, type, isVisible: true });
  };


  const _handlerGetReports = async () => {
    try {
      const dataRequest = {
        token:   user.token,
        params: +user.codPerfil,  
        bodyOptions: {}
      }
      const {data} = await getReportsbyCodPerfilWS(dataRequest);
      console.log(data);
      
      setReportOptions(
        data.map((item) => ({
          value: item.id,
          label: item.nomInforme,
          url: item.ruta
        }))
      );

    } catch (error) {
      console.error('Error:', error);
      const { response } = error;
      const jsonString = JSON.stringify(response.data, null, 2);
      _showToast(`Error ${response?.status || 'desconocido'}`, jsonString, "danger");
    }
  };

  const generateReport = () => {
    if (selectedReport === 0) {
      setShowToast({ type: "danger", title: "Error", isVisible: true, message: "Debe seleccionar un tipo de informe antes de continuar." });
      return;
    }
    setSearchTrigger(prev => prev + 1);  // Incrementa el trigger para disparar la búsqueda
    setShowReport(true);
  };

  const cleanReport = () => {
    setSelectedReport(0);
    setStartDate(parseDate(today));
    setEndDate(parseDate(today));
    setSearchTrigger(0);
    setShowReport(false);
  };

  const renderReportsHeader = () => (
    <Form>
      <Row>
        <Col md={3}>
          <SearchableSelect
            title="Tipo de Informe"
            options={reportsOptions}
            placeholder="Selecciona el informe..."
            onChange={(value) => setSelectedReport(value)}
            selectedValue={selectedReport}
            marginTop={0}
          />
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="startDate">Desde *</Label>
            <Flatpickr
              className="form-control"
              value={startDate ? new Date(startDate) : null}
              onChange={(date) => {
                const formattedDate = date[0]?.toISOString().split('T')[0];
                setStartDate(parseDate(formattedDate));
              }}
              options={{
                locale: Spanish,
                dateFormat: "d M, Y"
              }}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="endDate">Hasta *</Label>
            <Flatpickr
              className="form-control"
              value={endDate ? new Date(endDate) : null}
              onChange={(date) => {
                const formattedDate = date[0]?.toISOString().split('T')[0];
                setEndDate(parseDate(formattedDate));
              }}
              options={{
                locale: Spanish,
                dateFormat: "d M, Y"
              }}
            />
          </FormGroup>
        </Col>
        <Col md={5} className='mt-2'>
          <Row>
            <Col className='me-2 mt-3'>
              <Button color="btn btn-outline-primary" className='w-100' onClick={cleanReport}>Limpiar</Button>
            </Col>
            <Col className='me-2 mt-3'>
              <Button color="primary" className="w-100" onClick={generateReport}>Buscar</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );

  return (
    <Container className="p-3" fluid>
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title: "", message: "", type: "success", isVisible: false })}
      />
      <div className='d-flex mb-lg-2'>
        <KUPIICONS.Users height='16' width='16' stroke="#262626"/>
        <h6 className='f-bold mx-2 text-primary'> Informes / Ventas </h6>
      </div>
      <h3 className='mb-lg-4'>
        <strong className='text-primary' style={{fontSize: "25px"}}> l </strong> Búsqueda
      </h3>
      {renderReportsHeader()}
 
      {showReport && (
        <MyReportsView 
          user={user} 
          startDate={startDate} 
          endDate={endDate} 
          setShowToast={setShowToast} 
          searchTrigger={searchTrigger}  // Pasar el valor del trigger
          typeReport = {(reportsOptions.find((report) => report.value === selectedReport ))}
        />
      )}
    </Container>
  );
};

export default _myReportsView;
