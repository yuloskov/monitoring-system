import './css/ControlPanel.css';
import 'react-widgets/dist/css/react-widgets.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';

Moment.locale('en')
momentLocalizer()

function ControlPanel({ start, end, setEnd }) {
  return (
    <>
      <div className="panel">
        <Container bg='primary'>
          <Row style={{padding: '10px'}}>
            <Link to="/map" style={{width: '100%'}}>
              <Button block variant='secondary'>Map</Button>
            </Link>
          </Row>
          <Row style={{padding: '10px'}}>
            <Link to="/user_board" style={{width: '100%'}}>
              <Button block variant='secondary'>User Board</Button>
            </Link>
          </Row>

          <hr style={{background: '#e00a1e'}}/>

          <Row style={{padding: '10px'}}>
            From
            <DateTimePicker disabled value={start}/>
            To
            <DateTimePicker value={end} onChange={date => setEnd(date)}/>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ControlPanel;