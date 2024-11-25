/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Input, Label, Row, Table } from 'reactstrap';
// Estilos
import '@/pages/Users/UserProfile/styles/index.scss';
// Assets
import profileBg from '@/assets/images/bg-profile.jpg';
import avatar1   from '@/assets/images/users/user.jpg';

import { getprofilesAssignedbyUserWS }  from '@/slices/profiles/thunk';

import { _FormProfileUser } from './FormProfileUser'

export const _UserProfileSimpleView = () => {
  
  const user = useSelector(state => state.Login.user);

  const [ profiles, setProfiles ] = useState([]);
  const [ _loading , setLoading ] = useState(true);

  useEffect(() => {
    _getInformation();
  }, [user]);

  const _getInformation = async () => {
    try {
      await getProfiles();
    } catch (error) {
      console.error('Error fetching information:', error);
    } finally{
      setLoading(!_loading);
    }
  }

  const getProfiles = async () => {
    try {
      const { data } = await getprofilesAssignedbyUserWS(user.token, user.codUsuario);
      setProfiles(data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  }

  const background = (
    <div className="position-relative mx-n4 mt-n4">
        <div className="profile-wid-bg profile-setting-img">
            <img src={profileBg} className="profile-wid-img" alt="" />
        </div>
    </div>
  );

  const cardNameUser = (
    <Card className="mt-n5">
      <CardBody className="p-4">
        <div className="text-center">
          <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
            <img src={avatar1}
                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                alt="user-profile" />
            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
              <Input id="profile-img-file-input" type="file" className="profile-img-file-input" />
              <Label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="ri-camera-fill"></i>
                </span>
              </Label>
            </div>
          </div>
          <h5 className="fs-16 mb-1">{user.nomUsuario}</h5>
          <p className="text-muted mb-0">{user.apeUsuario}</p>
        </div>
      </CardBody>
    </Card>
  );

  const cardPerfilesAsociados = (
    <Card>
      <CardBody>
        <div className="live-preview">
          <div className="table-responsive">
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col">Empresa</th>
                  <th scope="col">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {
                  profiles.map((profile) => (
                    <tr key={profile.codPerfil}>
                      <td className="fw-medium">{profile.nomEmpresa}</td>
                      <td>{profile.nomPerfil}</td>
                    </tr>
                  ))
                }                
              </tbody>
            </Table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
  

  return (
    <>
      <Container fluid>
        { background }
        <Row>
          <Col xxl={4}>
            { cardNameUser }
            { cardPerfilesAsociados }
          </Col>

          <Col xxl={8}>
            <_FormProfileUser id={user.codUsuario}/>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default _UserProfileSimpleView;
