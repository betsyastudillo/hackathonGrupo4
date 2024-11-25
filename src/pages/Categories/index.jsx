import { Container, Row } from 'reactstrap';

import BreadCrumb   from '@/Components/Common/BreadCrumb';
import { _categoriesView } from './categories';

export const CategoriesView = () => {
  
  document.title = 'KUPI | Categorias';

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Categorias"
          />
          <Row>
            <_categoriesView />
          </Row>
        </Container>
      </div>
    </>
  );
};