import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, Table, Button  } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
// Componentes
import NoResult from '@/Components/Common/NoResult';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import Spinners from '@/Components/Common/Spinner';
// Slices
import { getSalesByUserWS } from '@/slices/thunks';
// Utilities
import { formatSaldoCOP } from '@/utilities';
// Para trabajar con csv pdf y excel
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const MySalesReport = ({ user, startDate, endDate, setShowToast, searchTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [dataReport, setDataReport] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(25);

  // Columnas para la tabla
  const columns = useMemo(() => [
    {
      Header: 'No. Transacción',
      accessor: 'numTransaccion',
    },
    {
      Header: 'Fecha de Aprobación',
      accessor: 'fecAprobacion',
      Cell: ({ value }) => value ? value.replace('T', ' ') : '',
    },
    {
      Header: 'Empresa',
      accessor: 'nomEmpresa',
    },
    {
      Header: 'Cliente',
      accessor: 'cliente',
    },
    {
      Header: 'Referencia',
      accessor: 'refTransaccion',
    },
    {
      Header: 'Valor',
      accessor: 'valTransaccion',
      Cell: ({ value }) => formatSaldoCOP(value),
    },
  ], []);

  // Tabla utilizando react-table
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, gotoPage } = useTable(
    { columns, data: dataReport, initialState: { pageIndex: 0, pageSize } },
    useSortBy,
    usePagination
  );

  // Función para obtener ventas
  const GetSalesByUser = async () => {
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
      
      const { data } = await getSalesByUserWS(dataRequest);
      setDataReport(data.value);
    } catch (err) {
      setDataReport([]);
      setShowToast({ title: "Error", message: "No se pudo obtener los datos.", type: "danger", isVisible: true });
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar GetSalesByUser cuando searchTrigger cambie
  useEffect(() => {
    if (searchTrigger > 0) {  // El valor se incrementa en el padre cada vez que se presiona "Buscar"
      GetSalesByUser();
    }
  }, [searchTrigger]);

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataReport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    XLSX.writeFile(workbook, "reporte-ventas.xlsx");
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 20, 10);
  
    const tableColumn = columns.map(col => col.Header);
    const tableRows = dataReport.map(row => columns.map(col => row[col.accessor]));
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("reporte-ventas.pdf");
  };

  // Cabeceras para el CSV
  const csvHeaders = columns.map(col => ({ label: col.Header, key: col.accessor }))

  const renderTable = () => (
    <>
      <Table {...getTableProps()} striped bordered hover>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Agregar un indicativo de ordenamiento */}
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
                <NoResult title="¡Lo sentimos!" message="No encontramos resultados para el intervalo de tiempo solicitado." />
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

  return (
    <Card>
      <CardBody>
        { loading ? <Spinners /> : (
          <>
            <div className="p-2"> 
              <Button className="m-2" color="outline-primary" onClick={exportToExcel}>Exportar Excel</Button>
              <Button className="m-2" color="outline-primary" onClick={exportToPDF}>Exportar PDF</Button>
              <CSVLink headers={csvHeaders} data={dataReport} filename="reporte-ventas.csv" className="btn btn-outline-primary">
                Exportar CSV
              </CSVLink>

            </div>
            {renderTable()}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MySalesReport;
