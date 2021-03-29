import './css/ControlPanel.css';
import 'react-widgets/dist/css/react-widgets.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link';
import {DateTimePicker} from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {Route} from 'react-router-dom';
import React, {useState} from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

Moment.locale('en');
momentLocalizer();

function ControlPanel({start, end, setEnd}) {
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    {name: 'Mean Buff Time', value: '1'},
    {name: 'Mean Quality', value: '2'},
  ];

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
            <Route path="/user_board">
              <div className="mb-1">
                <InputGroup className="mb-3">
                  <FormControl type="text" placeholder="User id"/>

                  <InputGroup.Append>
                    <Button variant="secondary">Search</Button>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </Route>

            <div className="mb-1">
              <div style={{color: '#ffffff'}}>From</div>
              <DateTimePicker disabled value={start}/>
            </div>

            <div className="mb-1">
              <div style={{color: '#ffffff'}}>To</div>
              <DateTimePicker value={end} onChange={date => setEnd(date)}/>
            </div>
          </Row>

          <Route path="/map">
            <Row style={{paddingLeft: '10px'}}>
              <div style={{color: '#ffffff'}} className="w-100">Options</div>
            </Row>

            <Row style={{paddingLeft: '10px', paddingRight: '10px'}}>
              <ButtonGroup toggle vertical className="w-100">
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Row>
          </Route>
        </Container>
      </div>
    </>
  );
}

export default ControlPanel;