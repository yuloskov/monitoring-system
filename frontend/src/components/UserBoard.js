import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import UserData from './UserData';

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

          <Col>
            <Card>
              <ScatterPlot/>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserBoard;