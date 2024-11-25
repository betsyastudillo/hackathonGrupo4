import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, } from 'reactstrap';
import { getPushUploadDetWS } from '../../../slices/notifications/Push/thunk';

import ToastKupi from '@/Components/Common/alertsNotification/toast';
import { toastDefault } from '../../../utilities';


export const _DetailsMassivePushView = () => {

  const { codUpload, codEstadoUpload } = useParams()

  const [ pushDetail, setPushDetail ] = useState([]);
  const [ showToast, setShowToast ] = useState(toastDefault);
  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    if (codUpload) {
      getDetailPushUpload(codUpload, codEstadoUpload);

    }
  }, [codUpload])


  const getDetailPushUpload = async (codUpload, codEstadoUpload) => {

    try {

      const { data } = await getPushUploadDetWS({params: codUpload, bodyOptions: codEstadoUpload});
      console.log("data", data)
      setPushDetail(data);

    } catch (error) {
      console.error('Error fetching types token:', error);
    }
  }


  const totalPages = Math.ceil(pushDetail.length / itemsPerPage);


  const currentItems = pushDetail.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  function renderPagination() {
    let pages = [];
    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev"
        className={`page-item pagination-prev ${
          currentPage === 1 ? 'disabled' : ''
        }`}
        to="#"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previo
      </Link>
    );
    // Mostrar la primera página siempre
    pages.push(
      <Link
        key="1"
        className={`page-item ${currentPage === 1 ? 'active' : ''}`}
        to="#"
        onClick={() => handlePageChange(1)}
      >
        1
      </Link>
    );
    // Si la página actual es mayor que 3, mostrar puntos suspensivos antes
    if (currentPage > 3) {
      pages.push(
        <span key="dots-prev" className="dots">
          ..
        </span>
      );
    }
    // Mostrar la página actual, o las dos páginas adyacentes
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <Link
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          to="#"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      );
    }
    // Si la página actual es más de 2 antes de la última, mostrar puntos suspensivos después
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots-next" className="dots">
          ..
        </span>
      );
    }
    // Mostrar la última página siempre
    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? 'active' : ''}`}
          to="#"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }
    // Agregar botón de "Siguiente"
    pages.push(
      <Link
        key="next"
        className={`page-item pagination-next ${
          currentPage === totalPages ? 'disabled' : ''
        }`}
        to="#"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Link>
    );

    return pages;
  }


  function _itemCount() {
    const _count =
      pushDetail.length > itemsPerPage
        ? itemsPerPage
        : pushDetail.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span>
          {' '}
          Mostrando {_count} de {pushDetail.length}
        </span>
      </div>
    );
  }


  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Número Documento</th>
          <th className='text-center'>Detalles</th>
          <th className='text-center'>Estado Registrado</th>
        </tr>
      </thead>
    );
  }


  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {}
        {currentItems.map((push, index) => (
          <tr key={index}>
            <td>{ push?.numLog }</td>
            <td>{ push?.numDocumento }</td>
            <td>{ push?.detalles }</td>
            <td className='text-center'>{ push?.estado }</td>
          </tr>
        ))}
      </tbody>
    );
  }


  const _tableListPush = () => {
    return (
      <div className='m-2'>
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
      <Card className='bodyTable p-2'>

        {_tableListPush()}
        
        {pushDetail.length > 0 && (
          <div className="d-flex justify-content-between">
            {_itemCount()}
            <div className="pagination-wrap hstack gap-2">
              {renderPagination()}
            </div>
          </div>
        )}
      </Card>
    </Container>
    </>
  );
}