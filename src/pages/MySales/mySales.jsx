import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
// Componentes
import { Container, Form, Row, Col, FormGroup, Label, Button, Card, CardBody, Table } from 'reactstrap';
import ToastKupi from '@/Components/Common/alertsNotification/toast';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'
// Table
import { useTable, usePagination, useSortBy } from 'react-table';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import Spinners from '@/Components/Common/Spinner';

// Utilities
import { toastDefault } from "@/utilities";
import KUPIICONS from '../../common/icons/icons';
import { getSalesByUserWS } from '../../slices/thunks';
import { formatDate, formatSaldoCOP, parseDate } from '../../utilities';
import { useNavigate }              from 'react-router-dom';


const _mySalesView = () => {
  const today = new Date().toISOString().split("T")[0];
  const user = useSelector(state => state.Login.user);
  const navigate  = useNavigate();

  

  // Valores de busqueda
  const [startDate, setStartDate]         = useState(parseDate(today));
  const [endDate, setEndDate]             = useState(parseDate(today));
  const [showReport, setShowReport]       = useState(false);
  const [showToast, setShowToast]         = useState(toastDefault);
  // Estado para disparar la búsqueda
  const [searchTrigger, setSearchTrigger] = useState(1);  
  // Valores para table
  const [pageIndex, setPageIndex]         = useState(0);
  const [pageSize]                        = useState(25);
  const [headers, setHeaders]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [dataReport, setDataReport]       = useState([]);

  // Definicion de columnas
  const columns = useMemo(() => {
    // Mapeamos las columnas si hay headers definidos
    const mappedColumns = headers && headers.length > 0 
      ? headers.map(header => ({
        Header: header.title,
        accessor: header.key,
        Cell: ({ value }) => {
          if (header.type === 'date') {
            return formatDate(value);
          }
          if (header.type === 'money') {
            return formatSaldoCOP(value);
          }
          return value;
        }
      })) 
      : [];
    
    // Definimos la columna de acciones de forma manual
    const actionColumn = {
      Header: 'Mis acciones',
      accessor: 'acciones',
      Cell: ({ row }) => (
        <div className="action-buttons d-flex justify-content-center">
          {/* Aquí puedes agregar tus componentes de React para las acciones */}
          <button 
            style={{
              borderRadius: '30px',
              height: '40px',
              width: '40px',
              color: "#FFF",
              border: '1px solid #690BC8'  // Corrección aquí
            }}
            onClick={() => handlePrinter(row.original)}
          >
            <KUPIICONS.Printer fill="#FFF" stroke='#690BC8' height='20' width='20' />
          </button>
        </div>
      ),
    };
  
    // Agregamos la columna de acciones al final
    return [...mappedColumns, actionColumn];
  }, [headers]);
  
  // Funciones para manejar las acciones
  const handlePrinter = (rowData) => {
    console.log("Editando:", rowData.numTransaccion);

    const newRoute = '/voucher/'+rowData.numTransaccion;  // La ruta que deseas abrir
    window.open(newRoute, '_blank');
  };
  
  // react-table setup
  const {  getTableProps, getTableBodyProps, headerGroups, prepareRow, page, gotoPage, } 
  = useTable(
    { columns, data: dataReport, initialState: { pageIndex: 0, pageSize } },
    useSortBy,
    usePagination
  );

  // Constantes para reportes
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataReport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kupi");
    XLSX.writeFile(workbook, "Kupi.xlsx");
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Kupi", 20, 10);
    const tableColumn = headers.map(header => header.title);
    const tableRows = dataReport.map(row => columns.map(col => row[col.accessor]));

    autoTable(doc, { head: [tableColumn], body: tableRows});
    doc.save("Kupi.pdf");
  };

  const csvHeaders = headers && headers.length > 0 ? headers.map(header => ({
    label: header.title,
    key: header.title.toLowerCase().replace(/\s/g, '')
  })) : [];

  useEffect(() => {
    if ( user.codPerfil ) _handlerGetSales();
  }, [user, searchTrigger])


  const _showToast = (title, message, type = 'success') => { setShowToast({ title, message, type, isVisible: true })};

  const generateReport = () => {
    setSearchTrigger(prev => prev + 1);  // Incrementa el trigger para disparar la búsqueda
    setShowReport(true);
  };

  const cleanReport = () => {
    setStartDate(parseDate(today));
    setEndDate(parseDate(today));
    setSearchTrigger(0);
    setShowReport(false);
  };

  const _handlerGetSales = async () => {
    console.log("entramos aqui");
    setLoading(true);
    _showToast( "Procesando...", "Por favor espere" );
    try {
      const dataRequest = {
        token: user.token,
        bodyOptions: {
          codEmpresa: user.codEmpresa.toString(),
          codSucursal: user.codSucursal ? user.codSucursal.toString() : "0",
          fechaInicial: formatDate(startDate),
          fechaFinal: formatDate(endDate),
        }
      };
      console.log(dataRequest);

      const { data } = await getSalesByUserWS(dataRequest);
      console.log("La data es --->", data);
      setDataReport(data.body);
      setHeaders(data.headers);
      setShowReport(true);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setDataReport([]);
      setHeaders([]);
      _showToast( "Error...", "No se pudo obtener los datos.", "danger" );
    } finally {
      setLoading(false);
    }
  };


  const renderReportsHeader = () => (
    <Form>
      <Row>
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
        <Col md ={3}/>
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

  const renderTable = () => (
    <>
      <Table {...getTableProps()} striped bordered hover>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ' ⏺'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length}>
                No hay resultados.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <PaginationBar
        totalItems={dataReport.length}
        itemsPerPage={pageSize}
        currentPage={pageIndex + 1}
        onPageChange={(page) => {
          setPageIndex(page - 1);
          gotoPage(page - 1);
        }}
      />
    </>
  );

  const _mytableSales = () => {
    return (
      <Card>
        <CardBody>
          {loading ? <Spinners /> : (
            <>
              <div className="p-2">
                <Button className="m-2" color="outline-primary" onClick={exportToExcel}>Exportar Excel</Button>
                <Button className="m-2" color="outline-primary" onClick={exportToPDF}>Exportar PDF</Button>
                <CSVLink headers={csvHeaders} data={dataReport} filename="kupi.csv" className="btn btn-outline-primary"> Exportar CSV </CSVLink>
              </div>
              {renderTable()}
            </>
          )}
        </CardBody>
      </Card>
    );
  }

  return(
    <Container className="p-3" fluid>
      <ToastKupi
        title={showToast.title}
        message={showToast.message}
        type={showToast.type}
        isVisible={showToast.isVisible}
        onClose={() => setShowToast({ title: "", message: "", type: "success", isVisible: false })}
      />
      <div className='d-flex mb-lg-2'>
        <KUPIICONS.Users height='16' width='16' stroke="#690BC8"/>
        <h6 className='f-bold mx-2 text-primary'> Mis Ventas </h6>
      </div>

      {renderReportsHeader()}
      { showReport && < _mytableSales /> }

    </Container>
  );
}

export default _mySalesView;
