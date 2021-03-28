import './css/ControlPanel.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

import {useState} from 'react';
import Card from 'react-bootstrap/Card';


function ControlPanel() {
  const [startDate, setStartDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState(['10:00', '11:00']);

  return (
    <>
      <div className="panel">
        <Container>
          <Row style={{padding: '10px'}}>
            <Link to="/map" style={{width: '100%'}}>
              <Button block>Map</Button>
            </Link>
          </Row>
          <Row style={{padding: '10px'}}>
            <Link to="/user_board" style={{width: '100%'}}>
              <Button block>User Board</Button>
            </Link>
          </Row>

          <hr/>

          <Row style={{padding: '10px'}}>
            <Card style={{padding: '10px', width: '100%'}}>
              Date
              <DatePicker selected={startDate} onChange={date => setStartDate(date)}/>
            </Card>
          </Row>
          <Row style={{padding: '10px'}}>
            <Card style={{padding: '10px', width: '100%'}}>
              Time Range
              <TimeRangePicker
                onChange={time => setTimeRange(time)}
                value={timeRange}
              />
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ControlPanel;