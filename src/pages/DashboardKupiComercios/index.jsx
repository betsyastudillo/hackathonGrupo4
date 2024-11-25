import { Card, CardBody, Col, Container, Row }  from 'reactstrap';
import { useState, useMemo, useEffect }         from 'react';

import { useSelector }        from 'react-redux';
import { Link }               from 'react-router-dom';
import BreadCrumb             from '@/Components/Common/BreadCrumb';
import banner                 from '@/assets/images/banner.svg';
import { linksKupicomercios } from '@/common/data/appsJobs';


export const Dashboard = () => {

  const [linksKupiComercios, setLinksKupiComercios] = useState();
  const [companyName, setCompanyName] = useState('');

  const [currentPage] = useState(1);

  const user      = useSelector(state => state.Login.user);
  const companies = useSelector(state => state.Companies.companies);

  //pagination
  const perPageData = 16;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentdata = useMemo(
    () => linksKupicomercios?.slice(indexOfFirst, indexOfLast),
    [indexOfFirst, indexOfLast]
  );

  useEffect(() => {
    setLinksKupiComercios(currentdata);
  }, [currentdata]);

  useEffect(() => {
    const result = companies.find(company => user.codEmpresa === company.codEmpresa);
    if(result) {
      setCompanyName(result.nomEmpresa);
    }
  }, [user, companies]);
  
  document.title = 'Dashboard | ' + companyName;

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Links" />
          <Row className="justify-content-center">
            <Col xxl={9}>
              <div className="image-container mb-4">
                <img
                  src={banner}
                  alt="Descripción de la imagen"
                  className="w-100"
                />
              </div>

              <Row className="job-list-row" id="companies-list">
                {(linksKupiComercios || []).map((item, key) => (
                  <Col xxl={3} md={6} key={key}>
                    <Card className="companiesList-card">
                      <CardBody>
                        <div className="text-center">
                          <lord-icon
                            src={item.image_src}
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: '55px', height: '55px' }}
                          ></lord-icon>
                        </div>

                        <div className="text-center">
                          <Link to={item.to}>
                            <h5 className="mt-3 company-name">
                              {item.lable}{' '}
                              <span className="text-primary">{item.span}</span>
                            </h5>
                          </Link>
                          <div className="d-none company-desc">
                            {item.company_info}
                          </div>
                          <p className="text-muted industry-type">
                            {item.industry_type}
                          </p>
                          <div className="d-none">
                            <span className="employee">{item.employee}</span>
                            <span className="location">{item.location}</span>
                            <span className="rating">{item.rating}</span>
                            <span className="website">{item.website}</span>
                            <span className="email">{item.email}</span>
                            <span className="since">{item.since}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
