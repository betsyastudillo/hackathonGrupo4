import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Input, Row } from 'reactstrap';
import { useSelector }        from 'react-redux';
// Estilos
import '@/pages/Users/UserProfile/styles/index.scss';
// Components
import KUPIICONS from '@/common/icons/icons';
import NoResult  from '@/Components/Common/NoResult';
import Spinners  from '@/Components/Common/Spinner';
import PaginationBar from '../../../Components/Common/tables/paginationBar';

import '@/pages/Users/SearchUsers/styles/index.scss';
// WS
import { findUsersByDocumentWS } from '@/slices/users/thunk';
import { formatSaldoCOP } from '../../../utilities';


export const _SearchUsersView = ({ id }) => {

  const navigate  = useNavigate();
  
  const user      = useSelector(state => state.Login.user);
  const [_loading , setLoading]            = useState(true);
  const [_searchingUser, setSearchingUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generando datos de ejemplo
  const [users, setUsers] = useState([]);

  // const users = [
  //   { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '123-456-7890', date: '01 Mar, 2022', status: 'Active' },
  //   { id: '2', name: 'Bob Smith', email: 'bob.s@example.com', phone: '234-567-8901', date: '12 Mar, 2022', status: 'Inactive' },
  //   { id: '3', name: 'Carol White', email: 'carol.w@example.com', phone: '345-678-9012', date: '23 Mar, 2022', status: 'Active' },
  //   { id: '4', name: 'David Brown', email: 'david.b@example.com', phone: '456-789-0123', date: '04 Apr, 2022', status: 'Active' },
  //   { id: '5', name: 'Emma Green', email: 'emma.g@example.com', phone: '567-890-1234', date: '15 Apr, 2022', status: 'Inactive' },
  //   { id: '6', name: 'Frank Black', email: 'frank.b@example.com', phone: '678-901-2345', date: '26 Apr, 2022', status: 'Active' },
  //   { id: '7', name: 'Grace Hall', email: 'grace.h@example.com', phone: '789-012-3456', date: '07 May, 2022', status: 'Inactive' },
  //   { id: '8', name: 'Henry Young', email: 'henry.y@example.com', phone: '890-123-4567', date: '18 May, 2022', status: 'Active' },
  //   { id: '9', name: 'Isabella King', email: 'isabella.k@example.com', phone: '901-234-5678', date: '29 May, 2022', status: 'Inactive' },
  //   { id: '10', name: 'Jack Walker', email: 'jack.w@example.com', phone: '012-345-6789', date: '10 Jun, 2022', status: 'Active' },
  // ];

  useEffect(() => {
    if(user?.token) _findUsersByDocumentWS();
  }, [user])
  
  const _findUsersByDocumentWS = async () => {
    try {      
      const { data } = await findUsersByDocumentWS(user.token, id);
      setUsers(data);

    } catch (err) {
      console.error('Error fetching menusPpal:', err);
    } finally {
      setLoading( !_loading);
    }
  }

  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter((user) =>
    (user?.nomUsuario.toLowerCase() + " " + user?.apeUsuario.toLowerCase()).includes(_searchingUser.toLowerCase()) ||  
    user?.telUsuario.toLowerCase().includes(_searchingUser.toLowerCase()) || 
    user?.numDocumento.toLowerCase().includes(_searchingUser.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onChangeData = (value) => {
    setSearchingUser(value);
    setCurrentPage(1); // Reset to page 1 on search
  };
  
  
  const _handlerGotoUser = (e, user) => {
    e.preventDefault();
    console.log(user)
    navigate('/perfil-usuario/'+ user.codUsuario);
  }
  
  function _tableTittles() {
    return (
      <thead className="table-light">
        <tr>
          <th scope="col" style={{ width: "50px" }}>ID</th>
          <th>Nombre</th>
          <th>Documento</th>
          <th>Bono</th>
          <th>Teléfono</th>
          <th className='d-flex justify-content-center'>Acciones</th>
        </tr>
      </thead>
    );
  }

  function _tableBody() {
    return (
      <tbody className="list form-check-all">
        {currentItems.map((user, index) => (
          <tr key={index}>
            <td>{user?.codUsuario}</td>
            <td>{user?.nomUsuario + " "+ user?.apeUsuario}</td>
            <td>{user?.numDocumento}</td>
            <td>{ formatSaldoCOP(user?.valBono + user?.valCupo+ user?.valPasacupo)}</td>
            <td>{user?.telUsuario}</td>
            <td>
              <div 
                className="gap-2 d-flex justify-content-center"           
                onClick={(e) => _handlerGotoUser(e, user)}
              >
                <KUPIICONS.Send/>
              </div>
            </td>
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
                <h4 className="card-title mb-0">Lista de Usuarios</h4>
              </CardHeader>
              <CardBody>
                <Row className="g-0 d-flex justify-content-end">
                  <Col lg={4} xl={4}>
                    <div className="position-relative">
                      <Input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Buscar..."
                        id="search-options"
                        value={_searchingUser}
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
                  </Col>
                </Row>
                <div className="table-responsive table-card mt-3 mb-1">
        
                  { _loading && <Spinners/> }
        
                  <table className="table align-middle table-nowrap" id="userTable">
                    {_tableTittles()}
                    { !_loading && (_tableBody()) }
                  </table>

                  { filteredUsers.length === 0 && !_loading && 
                    (
                      <NoResult/>
                    )
                  }
                </div>

                { // Filtered Users
                  filteredUsers.length > 0 && (
                    <PaginationBar
                    totalItems={filteredUsers.length}
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
};

export default _SearchUsersView;
