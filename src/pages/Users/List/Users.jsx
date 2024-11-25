import * as rs from 'reactstrap';
import { useState, useEffect }         from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import '@/pages/Users/List/styles/index.scss';
import KUPIICONS     from '../../../common/icons/icons';
// Constantes de trabajo
import { _typeList } from './constants/_constants';

export const _UsersView = () => {
  
  const _defualtForm = {
    typeList: ''
  };

  const [_form , setForm]     = useState(_defualtForm)
  const user      = useSelector(state => state.Login.user);
  
  const _cardHeader = () =>{ 
    return (
      <rs.CardHeader
        className="align-items-center border-1 d-flex"
        style={{ borderRadius: '10px' }}
      > 
        <h4 className="card-title mb-0 flex-grow-1">
          <span className='mx-2'>
            <KUPIICONS.Users />
          </span>
          Seleccionar Usuario
        </h4>
      </rs.CardHeader>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  function _cardBody () {
    return (
      <div className="card-body p-1">
        <rs.Form 
          className='row'
          action="#"
        >
          <rs.FormGroup className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
            <div className='mt-2 pl-16'>

              <rs.Label htmlFor="typeList" className="form-label">

                Tipo de Listado 
              </rs.Label>
              
              <select
                className='form-select mb-3 text-muted selectKupi'
                name="typeList"
                id="typeList"
                value   = { _form.typeList}
                onChange= {handleChange}
              >
                {_typeList.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </rs.FormGroup>
          <rs.FormGroup className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
            <div className='mt-2 pl-16'>

              <rs.Label htmlFor="typeList" className="form-label">
                Consumible en la Categoría
              </rs.Label>
              
              <select
                className='form-select mb-3 text-muted selectKupi'
                name="typeList"
                id="typeList"
                value   = { _form.typeList}
                onChange= {handleChange}
              >
                {_typeList.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </rs.FormGroup>
          <div className='divider'/>        
          
          <rs.FormGroup className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
            <div className='mt-2 pl-16'>

              <rs.Label htmlFor="typeList" className="form-label">
                Financiadora
              </rs.Label>
              
              <select
                className='form-select mb-3 text-muted selectKupi'
                name="typeList"
                id="typeList"
                value   = { _form.typeList}
                onChange= {handleChange}
              >
                {_typeList.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </rs.FormGroup>
          <rs.FormGroup className='col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4'>
            <div className='mt-2 pl-16'>

              <rs.Label for="typeList" className="form-label">
                Saldo mínimo
              </rs.Label>
              <rs.InputGroup>
                <rs.InputGroupText>
                  {/* SVG Icon */}
                  <KUPIICONS.DollarSign height='18' width='18'/>
                </rs.InputGroupText>
                <rs.Input placeholder="0" />
              </rs.InputGroup>
            </div>
          </rs.FormGroup>
        </rs.Form>
      </div>
    )
  }
  
  return (
    <>
      <ToastContainer />

      <rs.Row>
        <div style={{margin: "8px"}}>
          <span> Lista de Usuarios </span>
        </div>
        <rs.Row className='justify-content-center m-2'>
          <rs.Col xl={10}>
            <rs.Card className='card-height-60 br-10'>
              {_cardHeader()}
              { _cardBody()}
            </rs.Card>
          </rs.Col>
        </rs.Row>
      </rs.Row>
    </>
  );
};

export default _UsersView;