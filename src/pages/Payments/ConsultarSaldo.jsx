import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Col,
  Nav,
  Label,
  Input,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { useForm } from '../../hooks/useForm';

export const ConsultarSaldo = () => {
  const { onInputChange, onResetForm, cedula } = useForm({
    cedula: '',
  });

  const consultarSaldo = event => {
    event.preventDefault();
    const consulta = {
      cedula,
    };
    console.log({ consulta });
    onResetForm();
  };
  return (
    <>
      <Col xl={6}>
        {/* card-height-100 */}
        <Card className="card-height-100" style={{ borderRadius: '10px' }}>
          <CardHeader
            className="align-items-center border-1 d-flex"
            style={{ borderRadius: '10px' }}
          >
            <h4 className="card-title mb-0 flex-grow-1">
              Consultar Saldo de Bono Escolar
            </h4>
          </CardHeader>
          <div className="card-body p-0">
            <form className="p-5" onSubmit={consultarSaldo}>
              <div className="mb-5">
                <Label
                  htmlFor="valor"
                  className="form-label text-primary"
                  style={{ fontWeight: 'bold' }}
                >
                  No. de Cédula
                </Label>
                <Input
                  style={{
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: '1px #690BC8 solid',
                  }}
                  className="form-control"
                  placeholder="1115678000"
                  type="integer"
                  name="cedula"
                  value={cedula}
                  onChange={onInputChange}
                  //   onChange={validation.handleChange}
                  //   onBlur={validation.handleBlur}
                  //   value={validation.values.email || ''}
                  //   invalid={
                  //     validation.touched.email && validation.errors.email
                  //       ? true
                  //       : false
                  //   }
                />
                {/* {validation.touched.email && validation.errors.email ? (
                  <FormFeedback type="invalid">
                    {validation.errors.email}
                  </FormFeedback>
                ) : null} */}
              </div>
              <div className="text-end mt-3 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '200px' }}
                >
                  Consultar Saldo
                </button>
              </div>
            </form>
          </div>
        </Card>
      </Col>
    </>
  );
};
