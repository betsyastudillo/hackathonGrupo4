import PropTypes from 'prop-types';

const PaginationBar = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Función para generar los botones de paginación
  const renderPagination = () => {
    let pages = [];

    pages.push(
      <button 
        key="prev" 
        className={`page-item pagination-prev ${currentPage === 1 ? 'disabled' : ''}`} 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previo
      </button>
    );

    pages.push(
      <button 
        key="1" 
        className={`pagination-prev page-item ${currentPage === 1 ? 'active' : ''}`} 
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(<span key="dots-prev" className="dots">..</span>);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-prev page-item ${currentPage === i ? 'active' : ''}`} 
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="dots-next" className="dots">..</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <button 
          key={totalPages} 
          className={`pagination-prev page-item ${currentPage === totalPages ? 'active' : ''}`} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button 
        key="next" 
        className={`page-item pagination-next ${currentPage === totalPages ? 'disabled' : ''}`} 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    );

    return pages;
  };

  // Función para renderizar el conteo de ítems
  const itemCount = () => {
    const isLastPage = currentPage === totalPages;
  
    // Si es la última página, calcula cuántos elementos quedan
    const count = isLastPage ? totalItems % itemsPerPage || itemsPerPage : itemsPerPage;
  
    return (
      <span>Mostrando {count} de {totalItems}</span>
    );
  };
  

  return (
    <div className="d-flex justify-content-between">
      {itemCount()}
      <div className="pagination-wrap hstack gap-2">
        {renderPagination()}
      </div>
    </div>
  );
};

PaginationBar.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationBar;
