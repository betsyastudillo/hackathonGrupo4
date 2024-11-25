import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <Container fluid>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Skynet SAS.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Desarrollado por Skynet SAS
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
