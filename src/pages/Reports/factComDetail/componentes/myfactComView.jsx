import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardBody, Table, Button  } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
// Componentes
import NoResult from '@/Components/Common/NoResult';
import PaginationBar from '@/Components/Common/tables/paginationBar';
import Spinners from '@/Components/Common/Spinner';

import { useSelector } from "react-redux";
import { getInvoicesComercioWS } from "../../../../slices/reports/thunk";

// Utilities
import { formatSaldoCOP } from '@/utilities';
// Para trabajar con csv pdf y excel
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

export const _myfactComDetailView = ( {numTransaccion} ) => {

  const [loading, setLoading] = useState(false);
  const [dataReport, setDataReport] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const user = useSelector(state => state.Login.user);

  // Columnas para la tabla
  const columns = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Fecha',
      accessor: 'fecha',
      Cell: ({ value }) => value ? value.replace('T', ' ') : '',
    },
    {
      Header: 'Nombre',
      accessor: 'nombre',
    },
    {
      Header: 'Documento',
      accessor: 'documento',
    },
    {
      Header: 'Valor Transaccion',
      accessor: 'valor_Transaccion',
      Cell: ({ value }) => formatSaldoCOP(value),
    },
    {
      Header: 'Valor Costo',
      accessor: 'valor_Costo',
      Cell: ({ value }) => formatSaldoCOP(value),
    },
  ], [])

  // Tabla utilizando react-table
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, gotoPage } = useTable(
    { columns, data: dataReport, initialState: { pageIndex: 0, pageSize } },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (user) _getInformation();
  }, [user]);

  const _getInformation = async () => {
    setLoading(true);    

    try {
      const dataRequest = {
        params: numTransaccion,
        token: user.token,
        bodyOptions: []
      }
      const { data } = await getInvoicesComercioWS(dataRequest);
      console.log(data)
      if (data.detail) {
        setDataReport(data.detail);
      }
    } catch (error) {
      setDataReport([]);
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

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
                <NoResult title="¡Lo sentimos!" message="No encontramos resultados para esta referencia." />
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
}