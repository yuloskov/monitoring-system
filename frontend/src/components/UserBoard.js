import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';

function UserBoard() {
  return (
    <>
      <div className="d-flex justify-content-center" style={{padding: '10px'}}>
        <Form inline>
          <FormControl type="text" placeholder="User id" className="mr-sm-2"/>
          <Button variant="primary">Search</Button>
        </Form>
      </div>

      <Container fluid style={{ paddingLeft: 0, paddingRight: 10}}>
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
    </>
  );
}

export default UserBoard;