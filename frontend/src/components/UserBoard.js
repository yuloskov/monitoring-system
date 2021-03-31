import React, {useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import UserInfo from './UserInfo';
import UserContentTable from './UserContentTable';
import QualityChart from './QualityChart';

function UserBoard({ start, end }) {
  return (
    <div>
      <Container fluid style={{paddingLeft: 20, paddingRight: 20}}>
        <Row className="mt-3">
          <Col md={6} className="mb-3">
            <Card>
              <UserInfo start={start} end={end}/>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="mb-3">
            <Card>
              <BarChart start={start} end={end}/>
            </Card>
          </Col>

          <Col className="mb-3">
            <Card>
              <QualityChart start={start} end={end}/>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Card>
              <UserContentTable start={start} end={end}/>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserBoard;