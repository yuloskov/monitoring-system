import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import UserData from './UserData';
import UserContentTable from './UserContentTable';

function UserBoard() {
  return (
    <div>
      <Container fluid style={{paddingLeft: 20, paddingRight: 20}}>
        <Row className="mt-3">
          <Col md={6} className="mb-3">
            <Card>
              <UserData/>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="mb-3">
            <Card>
              <BarChart/>
            </Card>
          </Col>

          <Col className="mb-3">
            <Card>
              <ScatterPlot/>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Card>
              <UserContentTable/>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserBoard;