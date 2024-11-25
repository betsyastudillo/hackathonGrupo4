import { Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import _mySalesView from "./mySales";

export const MySalesView = () => {
  document.title = 'Mis Ventas | Kupi ';
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Mis Ventas" />
          <Row>
            < _mySalesView />
          </Row>
        </Container>
      </div>
    </>
  );
};