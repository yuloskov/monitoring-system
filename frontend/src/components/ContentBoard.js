import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BarChart from './BarChart';
import BufferingPlot from './BufferingPlot';
import {primary} from '../constants';
import ContentInfo from './ContentInfo';
import ContentViewsChart from './ContentViewsChart';
import DeviceTypeChart from './DeviceTypeChart';

function ContentBoard({ start, end }) {
  return (
    <div>
      <Container fluid style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Row className="mt-3">
          <Col className="mb-3">
            <Card style={{backgroundColor: primary}}>
              <ContentInfo start={start} end={end}/>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="mb-3">
            <Card style={{backgroundColor:primary}}>
              <Card.Header style={{color: '#fff'}}>Buffering duration histogram</Card.Header>
              <BufferingPlot start={start} end={end}/>
            </Card>
          </Col>

          <Col className="mb-3">
            <Card style={{ backgroundColor: primary }}>
              <Card.Header style={{ color: '#fff' }}>Quality distribution</Card.Header>
              <BarChart start={start} end={end} />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="mb-3">
            <Card style={{ backgroundColor: primary }}>
              <Card.Header style={{ color: '#fff' }}>Active viewers</Card.Header>
              <ContentViewsChart start={start} end={end} />
            </Card>
          </Col>
          <Col className="mb-3">
            <Card style={{ backgroundColor: primary }}>
              <Card.Header style={{ color: '#fff' }}>Device types</Card.Header>
              <DeviceTypeChart start={start} end={end} />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContentBoard;