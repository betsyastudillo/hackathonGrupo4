/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row, Card, CardBody, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import '@/pages/Reports/LogTransactions/styles/index.scss';
import '../../../assets/scss/plugins/icons/_remixicon.scss';
import Swal from 'sweetalert2';

import { postResentPin, postResentPinVoz }  from '@/slices/payments/resendersPin/thunk.ts';
import { getReportsLogsTransactions }  from '@/slices/reports/thunk.ts';

import KUPIICONS from '@/common/icons/icons';


export const _LogTransactionsView = () => {

  
  const [ _loading , setLoading ] = useState(true);
  const [ listTransactions, setListTransactions ] = useState([]);
  const user = useSelector(state => state.Login.user);

  const [ _searchingTransactions, setSearchingTransactions ] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    _getInformation();
  }, []);

  const _getInformation = async () => {
    try {
      await Promise.all([getTransactions()]);
    } catch (error) {
      console.error('Error fetching information:', error);
    } finally{
      setLoading(!_loading);
    }
  }

  const resendPin = async (numTransaccion, isPinVoz = false) => {
    try {
      setLoading(true);
      const dataRequest = {
        token: user.token,
        bodyOptions: {
          numTransaccion: numTransaccion.toString()
        }
      };
      const { data } = isPinVoz
        ? await postResentPinVoz(dataRequest)
        : await postResentPin(dataRequest);
      await Swal.fire({
        title: 'Envío de Pin',
        text: 'El pin se ha reenviado exitosamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 2000
      });
      console.log(data)

    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al reenviar el pin\n' + err,
        icon: 'error',
        confirmButtonText: 'Continuar',
      });
    } finally {
      setLoading(false);
    }
  }

  const getTransactions = async () => {
    try {
      const { data } = await getReportsLogsTransactions();
      setListTransactions(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching logsTransactions:', err);
    }
  }

  const obtenerTiempoTranscurrido = (fecSolicitud) => {
    const fechaSolicitud = new Date(fecSolicitud);
    const ahora = new Date();
    const diferencia = ahora - fechaSolicitud; // Diferencia en milisegundos.

    // Convertimos la diferencia a horas, minutos y segundos.
    const horas = String(Math.floor(diferencia / (1000 * 60 * 60))).padStart(2, '0');
    const minutos = String(Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const segundos = String(Math.floor((diferencia % (1000 * 60)) / 1000)).padStart(2, '0');

    // Retornamos el tiempo transcurrido en formato HH:MM:SS.
    return `${horas}:${minutos}:${segundos}`;
  }

  const colorRow = (codEstado) => {
    switch (codEstado) {
      case 0:
        return'rgba(255, 0, 0, 0.2)'; //Inactivo
      // case 1:
      //   return'rgba(255, 0, 0, 0.1)'; //Activo
      case 2:
        return'rgba(255, 165, 0, 0.1)'; //Pendiente
      case 3:
        return'rgba(0, 255, 0, 0.1)'; //Aprobado
      case 4:
        return'rgba(255, 0, 0, 0.1)'; //Negado
      case 5:
        return'rgba(255, 165, 0, 0.1)'; //Pendiente
      case 6:
        return'rgba(255, 255, 0, 0.1)'; //En espera
      default:
        return 'transparent';
    }
  }

  
  const filteredTransactions = listTransactions.filter((transactions) => 
    (transactions?.nomEmpresa || '').toLowerCase().includes(_searchingTransactions.toLowerCase()) || 
    (transactions?.nomCompleto || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    (transactions?.fecSolicitud || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    (transactions?.fecAprobacion || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    (transactions?.nomTransaccion || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    (transactions?.nomEstado || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    String(transactions?.codEstado || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    String(transactions?.numTransaccion || '').toLowerCase().includes(_searchingTransactions.toLowerCase())  ||
    String(transactions?.valTransaccion || '').toLowerCase().includes(_searchingTransactions.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  
  const currentItems = filteredTransactions.slice(
    pageIndex * pageSize, 
    (pageIndex + 1) * pageSize
  );


  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setPageIndex(page -1)
    }
  }
  

  const onChangeData = (value) => {
    setSearchingTransactions(value);
    setPageIndex(0);
  }
  
  
  function renderPagination() {
    let pages = [];

    // Agregar botón de "Previo"
    pages.push(
      <Link
        key="prev" className={`page-item pagination-prev ${pageIndex === 0 ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(pageIndex)}
      >
        Previo
      </Link>
    );

    // Mostrar la primera página siempre
    pages.push(
      <Link
        key="1"   className={`page-item ${pageIndex === 0 ? 'active' : ''}`}
        to="#"    onClick={() => handlePageChange(1)}
      >
        1
      </Link>
    );  

    // Si la página actual es mayor que 3, mostrar puntos suspensivos antes
    if (pageIndex > 2) {
      pages.push(<span key="dots-prev" className="dots">..</span>);
    } 

    // Mostrar la página actual, o las dos páginas adyacentes
    for (let i = Math.max(2, pageIndex); i <= Math.min(totalPages - 1, pageIndex + 2); i++) {
      pages.push(
        <Link
          key={i}  className={`page-item ${pageIndex === i - 1 ? 'active' : ''}`}
          to="#"   onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      );
    }

    // Si la página actual es más de 2 antes de la última, mostrar puntos suspensivos después
    if (pageIndex < totalPages - 3) {
      pages.push(<span key="dots-next" className="dots">..</span>);
    }

    // Mostrar la última página siempre
    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}  className={`page-item ${pageIndex === totalPages - 1 ? 'active' : ''}`}
          to="#"  onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Link>
      );
    }

    // Agregar botón de "Siguiente"
    pages.push(
      <Link
        key="next" className={`page-item pagination-next ${pageIndex === totalPages - 1 ? 'disabled' : ''}`}
        to="#"     onClick={() => handlePageChange(pageIndex + 2)}
      >
        Siguiente
      </Link>
    );
  
    return pages;
  }


  function _itemCount(){
    const _count = (filteredTransactions.length > pageSize) ?  pageSize : filteredTransactions.length;
    return (
      <div className="pagination-wrap hstack gap-2">
        <span> Mostrando { _count } de { filteredTransactions.length}</span>
      </div>
    );
  }



  return (
    <>
      <Col lg={12}>
        <Card>
          {/* <CardHeader>
            <h4 className="card-title mb-0">Add, Edit & Remove</h4>
            </CardHeader> */}

          <CardBody>
            <div className="listjs-table" id="customerList">
              <Row className="g-4 mb-3">
                {/* <Col className="col-sm-auto">
                    <div>
                        <Button color="success" className="add-btn me-1" onClick={() => tog_list()} id="create-btn"><i className="ri-add-line align-bottom me-1"></i> Add</Button>
                        <Button className="btn btn-soft-danger"
                        // onClick="deleteMultiple()"
                        ><i className="ri-delete-bin-2-line"></i></Button>
                      </div>
                </Col> */}
                <Col className="col-sm">
                  <div className="d-flex justify-content-sm-end">
                    <div className="search-box ms-2">
                      <Input 
                        type="text" 
                        className="form-control search" 
                        placeholder="Search..."
                        value={_searchingTransactions}
                        onChange={(e) => onChangeData(e.target.value)} 
                      />
                      <span className="search-icon position-absolute">
                        <KUPIICONS.Search height="20" width="20" />
                      </span>
                      <span
                        className="mdi mdi-close-circle search-widget-icon search-widget-icon-close position-absolute"
                        id="search-close-options"
                        onClick={() => onChangeData('')}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive table-card mt-3 mb-1">
                <table className="table align-middle " id="customerTable">
                  <thead className="table-light">
                    <tr>
                      <th data-sort="customer_name">ID</th>
                      <th data-sort="email">Fecha Registro</th>
                      <th data-sort="phone">Fecha Aprobación</th>
                      <th data-sort="date">Demora</th>
                      <th data-sort="status">Transacción</th>
                      <th data-sort="action">Nombre</th>
                      {/* <th data-sort="action">Financia</th> */}
                      <th data-sort="action">Empresa</th>
                      <th data-sort="action">Sucursal</th>
                      <th data-sort="action">Celular</th>
                      <th data-sort="action">Valor</th>
                      <th data-sort="action">SMS</th>
                      <th data-sort="action">Voz</th>
                      <th data-sort="action">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {currentItems.map((transaction) => (
                      <tr key={transaction.numTransaccion} style={{ backgroundColor: colorRow(transaction.codEstado) }}>
                        <td className="id" style={{ display: "none" }}><Link to="#" className="fw-medium link-primary">{transaction.numTransaccion}</Link></td>
                        <td className="customer_name">{transaction.numTransaccion}</td>
                        <td className="email">{transaction.fecSolicitud}</td>
                        <td className="phone">{transaction.fecAprobacion}</td>
                        <td className="date">{obtenerTiempoTranscurrido(transaction.fecSolicitud)}</td>
                        <td className="date">{transaction.nomTransaccion}</td>
                        <td className="date">{transaction.nomCompleto}</td>
                        {/* <td className="date">{transaction.nomFinancia}</td> */}
                        <td className="date">{transaction.nomEmpresa}</td>
                        <td className="date">{transaction.nomSucursal}</td> {/* TODO: cambiar a nomSucursal */}
                        <td className="date">{transaction.telUsuario}</td>
                        <td className="date" align='right'>{transaction.valTransaccion}</td>
                        <td className="date">
                          <Button
                            color='success'
                            className='btn-icon'
                            onClick={() => resendPin(transaction.numTransaccion)}
                          >
                            <i className=' ri-send-plane-line' />
                          </Button>
                        </td>
                        <td className="date">
                          <Button
                            color='info'
                            className='btn-icon'
                            onClick={() => resendPin(transaction.numTransaccion, true)}
                          >
                            <i className=' ri-record-mail-line' />
                          </Button>
                        </td>
                        <td className="date">{transaction.nomEstado}</td>
                        {/* <td className="status"><span className="badge bg-success-subtle text-success text-uppercase">Active</span></td>
                        <td>
                          <div className="d-flex gap-2">
                            <div className="edit">
                              <button className="btn btn-sm btn-success edit-item-btn" data-bs-toggle="modal" data-bs-target="#showModal">Edit</button>
                            </div>
                            <div className="remove">
                              <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                            </div>
                          </div>
                        </td> */}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
              <div className="noresult">
                <div className="text-center">
                  <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop"
                  colors="primary:#121331,secondary:#08a88a" style={{ width: "75px", height: "75px" }}>
                  </lord-icon>
                  <h5 className="mt-2">¡Lo sentimos! No se encontraron resultados</h5>
                    <p className="text-muted mb-0">No hemos encontrado transacciones que coincidan con tu búsqueda.</p>
                </div>
              </div>
              )}
              </div>
              {
                filteredTransactions.length > 0 && (
                  <div className="d-flex justify-content-between">
                    {_itemCount()}
                    <div className="pagination-wrap hstack gap-2">
                      {renderPagination()}
                    </div>
                  </div>
                )
              }
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}