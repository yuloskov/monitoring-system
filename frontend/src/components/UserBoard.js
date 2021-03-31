import React, {useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import UserInfo from './UserInfo';
import UserContentTable from './UserContentTable';
import QualityChart from './QualityChart';

function UserBoard({userBoardData}) {
  return (
    <div>
      <Container fluid style={{paddingLeft: 20, paddingRight: 20}}>
        <Row className="mt-3">
          <Col md={6} className="mb-3">
            <Card>
              <UserInfo userInfo={userBoardData['info']}/>
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
              <QualityChart qualityChartData={userBoardData['qualityChart']}/>
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