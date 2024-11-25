/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
// componentes
import PaginationBar from '@/Components/Common/tables/paginationBar';
import Spinners from '@/Components/Common/Spinner';
// Slices
import { DynamicIconButtonURL, formatDate, formatSaldoCOP, formatTipoPago } from '../../../utilities';
import { skeletonWS } from '../../../slices/sales/thunk';

const MyReportsView = ({ user, startDate, endDate, setShowToast, searchTrigger, typeReport = {value: 0, label: '', url: ''}  }) => {

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(25);
  const [headers, setHeaders] = useState([]);
  const [totals,  setTotals] = useState([]);

  const [loading, setLoading] = useState(false);
  const [dataReport, setDataReport] = useState([]);

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

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Kupi.pdf");
  };
  const csvHeaders = headers && headers.length > 0 ? headers.map(header => ({
    label: header.title,
    key: header.title.toLowerCase().replace(/\s/g, '')
  })) : [];
  

  const _handlerActionColumns = () => {
    switch (typeReport.value) {
      case 7:
        // const actionColumn = []
        return [];
    
      default:
        return null;
    }
  }

  
  const columns = useMemo(() => {

    const mappedColumns = headers && headers.length > 0 
    ? headers.map(header => ({
      Header: header.title,
      accessor: header.key,
      Cell: ({ row  }) => {
        if (header.type === 'date') {
          return formatDate(row.original[header.key]);
        }
        if (header.type === 'money') {
          return formatSaldoCOP(row.original[header.key]);
        }

        if (header.type === 'tipoPago') {
          return formatTipoPago(row.original[header.key]);
        }

        if (header.type === 'action-url') {
          return DynamicIconButtonURL(header, row.original);
        }
        return row.original[header.key];
      }
    })) 
    : [];

    const actionColumns = _handlerActionColumns();
    if (actionColumns) {
      return [...mappedColumns, ...actionColumns]
    } 

    return mappedColumns;

  }, [headers]);
  
  // react-table setup
  const {  getTableProps, getTableBodyProps, headerGroups, prepareRow, page, gotoPage, } 
  = useTable(
    { columns, data: dataReport, initialState: { pageIndex: 0, pageSize } },
    useSortBy,
    usePagination
  );

  const fetchData = () => {
    switch (typeReport.value) {
      case 0:
        break;
      default:
        _handlerSkeleton()
        break;
    }
  }
  
  // Trigger fetch when searchTrigger changes
  useEffect(() => {
    if (searchTrigger > 0 && typeReport.value > 0) fetchData();
  }, [searchTrigger, typeReport]);
  

  // Los WebServices
  // Función para obtener ventas
  const _handlerSkeleton = async () => {
    setLoading(true);
    setShowToast({ title: "Procesando...", message: "Por favor espere", type: "", isVisible: true });
    try {
      const dataRequest = {
        token: user.token,
        bodyOptions: {
          codEmpresa: user.codEmpresa.toString(),
          codSucursal: user.codSucursal ? user.codSucursal.toString() : "0",
          fechaInicial: startDate,
          fechaFinal: endDate,
        }
      };
      
      const baseURL = import.meta.env.VITE_BASE_URL_WS;
      const { data } = await skeletonWS(dataRequest, baseURL+typeReport.url);
      console.log(data);
      setDataReport(data.body);
      setHeaders(data.headers);
      setTotals(data?.totals ? data.totals : []);

    } catch (err) {
      setDataReport([]);
      setHeaders([]);
      setShowToast({ title: "Error", message: "No se pudo obtener los datos.", type: "danger", isVisible: true });
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const renderTotals = () => (
    <>
      {
        totals.length > 0 ? 
        (
          totals.map( row => {
            return (
              <div
                className="d-flex justify-content-lg-start align-items-center"
                style={{
                  maxWidth: '350px',
                  padding: '5px'
                }}
              >
                <h6
                  style={{
                    padding: '5px',
                    margin: 0,
                    minWidth: '150px', // Ajusta según el espacio que necesites
                    color: '#000'
                  }}

                  className='f-bold'
                >
                  {row.title}
                </h6>
                <span
                  className="ms-3"
                  style={{
                    padding: '5px',
                    margin: 0
                  }}
                >
                  {formatSaldoCOP(row.value)}
                </span>
              </div>

            )

          })
        )
        : null
      }
    </>
  );

  return (
    <Card>
      <CardBody>
        {loading ? <Spinners /> : (
          <>
            {renderTotals()}

            <div className="p-2">
              <Button className="m-2" color="outline-primary" onClick={exportToExcel}>Exportar Excel</Button>
              <Button className="m-2" color="outline-primary" onClick={exportToPDF}>Exportar PDF</Button>
              <CSVLink headers={csvHeaders} data={dataReport} filename="kupi.csv" className="btn btn-outline-primary">
                Exportar CSV
              </CSVLink>
            </div>

            {renderTable()}
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default MyReportsView;