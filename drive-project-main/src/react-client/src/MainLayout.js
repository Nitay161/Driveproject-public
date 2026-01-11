import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import SideMenu from './navigation/SideMenu';
import TopMenu from './navigation/TopMenu';

const MainLayout = () => {
  return (
    <div className="vh-100 d-flex flex-column">
        <TopMenu />
        <Container fluid className="flex-grow-1 p-0">
            <Row className="g-0 h-100">
            <Col md={3} lg={2} className="bg-light border-end">
                <SideMenu />
            </Col>

            <Col md={9} lg={10} className="p-4">
                <Outlet />
            </Col>
            </Row>
        </Container>
    </div>
  );
};

export default MainLayout;