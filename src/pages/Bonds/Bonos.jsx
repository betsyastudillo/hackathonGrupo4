import { Card, CardBody, CardHeader, Col, Container, Input, Row } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Components
import KUPIICONS from '@/common/icons/icons';
import NoResult from '@/Components/Common/NoResult';
import Spinners from '@/Components/Common/Spinner';
import PaginationBar from '@/Components/Common/tables/paginationBar';

// WS
import { getClassesBondsWS } from '../../slices/thunks';

export const _BonosView = () => {

  const user = useSelector(state => state.Login.user);
  const [_loading , setLoading]        = useState(true);
  const [_searchingClaseBono, setsearchingClaseBono] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  // DataTable
  const [clasesdeBonos, setClaseBonos] = useState([]);

  useEffect(() => { if (user?.token) _getClassessBonds(); }, [user]);

  const _getClassessBonds = async () => {
    try {
      const { data } = await getClassesBondsWS(user.token);
      console.log(data);
      setClaseBonos(data);
    } catch (err) {
      console.error('Error fetching getClassesBondsWS:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar bonos según búsqueda
  const filtered = clasesdeBonos.filter((claseBono) =>
    claseBono?.claseBono.toString().toLowerCase().includes(_searchingClaseBono.toLowerCase()) || 
    claseBono?.tipoBono.toLowerCase().includes(_searchingClaseBono.toLowerCase()) ||
    claseBono?.nomBono.toLowerCase().includes(_searchingClaseBono.toLowerCase()) ||
    claseBono?.obsBono.toLowerCase().includes(_searchingClaseBono.toLowerCase()) ||
    claseBono?.vencimiento.toString().toLowerCase().includes(_searchingClaseBono.toLowerCase()) ||  // assuming it's a number
    claseBono?.nomEmpresa.toLowerCase().includes(_searchingClaseBono.toLowerCase()) 
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeData = (value) => {
    setsearchingClaseBono(value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: "50px" }}> Clase Bono </th>
          <th>Nombre</th>
          <th>Financiador</th>
          <th>Tipo</th>
          <th>Observación</th>
          <th>Vencimiento</th>
          <th>Unico</th>
          <th>Retirable</th>
          <th>Transferible</th>
          <th>Restringido</th>
          <th>Centro de costo</th>
          <th>Visible al financiador </th>
          {/* <th className='d-flex justify-content-center'>Acciones</th> */}
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        { currentItems.map((claseBono, index) => (
          <tr key={index}>
             <td>{claseBono?.claseBono}</td>
             <td>{claseBono?.nomBono }</td>
             <td>{claseBono?.nomEmpresa }</td>
             <td>{claseBono?.tipoBono }</td>
             <td>{claseBono?.obsBono }</td>
             <td>{claseBono?.vencimiento }</td>
             <td>{claseBono?.unico }</td>
             <td>{claseBono?.retiro }</td>
             <td>{claseBono?.transferible }</td>
             <td>{claseBono?.restringido }</td>
             <td>{claseBono?.centroCosto }</td>
             <td>{claseBono?.codEstado }</td>
             {/* <td>
               <div 
                 className="gap-2 d-flex justify-content-center"           
                 onClick={(e) => _handlerGotoUser(e, claseBono)}
               >
                 <KUPIICONS.Send/>
               </div>
             </td> */}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <>
      <Container fluid>
        <Row className="g-0 align-items-center">
          <Col xl={12}>
            <Card className="bodyTable">
              <CardHeader>
                <h4 className="card-title mb-0">Lista de Bonos</h4>
              </CardHeader>
              <CardBody>
                <Row className="g-0 d-flex justify-content-end">
                  <Col lg={4} xl={4}>
                    <div className="position-relative">
                      <Input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Buscar..."
                        value={_searchingClaseBono}
                        onChange={(e) => onChangeData(e.target.value)}
                      />
                      <span className="search-icon position-absolute">
                        <KUPIICONS.Search height="20" width="20" />
                      </span>
                      <span
                        className="mdi mdi-close-circle search-widget-icon search-widget-icon-close position-absolute"
                        onClick={() => onChangeData('')}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="table-responsive table-card mt-3 mb-1">
                  { _loading && <Spinners /> }

                  <table className="table align-middle table-nowrap" id="userTable">
                    {_tableTittles()}
                    { !_loading && (_tableBody()) }
                  </table>

                  { filtered.length === 0 && !_loading && 
                    (
                      <NoResult/>
                    )
                  }
                </div>
                
                { // Filtered 
                  filtered.length > 0 && (
                    <PaginationBar
                    totalItems={filtered.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    />
                  )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default _BonosView;

