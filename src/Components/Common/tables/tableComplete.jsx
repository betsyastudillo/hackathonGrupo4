import { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import PropTypes from 'prop-types';
import PaginationBar from '@/Components/Common/tables/paginationBar';


const MyTableKupi = ({ itemPerPage = 25, data, columns, filters }) => {
  
  const [filteredData, setFilteredData] = useState(data);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(itemPerPage);

  // Aplicar filtros dinámicos basados en los filtros enviados desde el padre
  useEffect(() => {
    let filtered = data;
    filters.forEach((filter) => {
      filtered = filtered.filter(item =>
        String(item[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
      );
    });
    setFilteredData(filtered);
    setPageSize(itemPerPage);

  }, [data, filters, itemPerPage]);

  // Configurar react-table
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = 
  useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex, pageSize },
      pageCount: Math.ceil(filteredData.length / pageSize),
    },
    useFilters, useSortBy, usePagination
  );

  // Función para export
  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.Header);
    const tableRows   = data.map(row => columns.map(col => row[col.accessor]));

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('Kupi.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kupi");
    XLSX.writeFile(workbook, "Kupi.xlsx");
  };

  const csvHeaders = columns && columns.length > 0 ? columns.map(header => ({
    label: header.Header,
    key: header.Header.toLowerCase().replace(/\s/g, '')
  })) : [];


  // componente de Export
  const _exportItems = () => {
    return (
      <div className="p-2">
        <Button className="m-2" color="outline-primary" onClick={exportExcel}>Exportar Excel</Button>
        <Button className="m-2" color="outline-primary" onClick={exportPDF}>Exportar PDF</Button>
        <CSVLink headers={csvHeaders} data={data} filename="kupi.csv" className="btn btn-outline-primary">
          Exportar CSV
        </CSVLink>
      </div>
    )
  }


  return (
    <div>

      { _exportItems () }

      {/* Renderizar tabla */}
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map( (headerGroup, index ) => (
            <tr {...headerGroup.getHeaderGroupProps()} key= {`headerGroup-${index}`} >
              {headerGroup.headers.map( (column, colIndex) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`column-${colIndex}`}>
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ' ⏺'}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map( (row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${rowIndex}`} >
                {row.cells.map( (cell, cellIndex) => (
                  <td {...cell.getCellProps()} key={`cell-${cellIndex}`}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginación usando PaginationBar */}
      <div className='p-3'>
        <PaginationBar
            totalItems={filteredData.length} // Total de elementos filtrados
            itemsPerPage={pageSize} // Tamaño de página
            currentPage={pageIndex + 1} // Página actual
            onPageChange={(page) => {
              setPageIndex(page - 1); // Actualizar el índice de página
            }}
          />
      </div>
    </div>
  );
};


MyTableKupi.propTypes = {
  itemPerPage: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
  })).isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

export default MyTableKupi;