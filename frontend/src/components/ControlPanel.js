import './css/ControlPanel.css';
import 'react-widgets/dist/css/react-widgets.css';
import {OPTION_BUFF, OPTION_QUALITY} from '../constants';
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
import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';

Moment.locale('en');
momentLocalizer();

function ControlPanel({start, end, setEnd, option, setOption, setUserBoardData}) {
  const radios = [
    {name: 'Mean Buff Time', value: OPTION_BUFF},
    {name: 'Mean Quality', value: OPTION_QUALITY},
  ];

  const userBoardData = {};

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    userBoardData['info'] = await getUserInfo(formData);
    userBoardData['qualityChart'] = await getQualityChartData(formData);
    setUserBoardData(userBoardData);
  }

  async function getUserInfo(formData) {
    const profile_id = formData.get('user_id');
    console.log(profile_id, start, end);
    const res = await fetch(`http://localhost:5000/api/user_board/metrics/info?start=${start.toISOString()}&end=${end.toISOString()}&profile_id=${profile_id}`);
    return await res.json();
  }

  async function getQualityChartData(formData) {
    const profile_id = formData.get('user_id');
    const res = await fetch(`http://localhost:5000/api/user_board/metrics/quality_chart?profile_id=${profile_id}&start=${start.toISOString()}&end=${end.toISOString()}`,);
    return await res.json();
  }


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
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <FormControl type="text" name="user_id" placeholder="User id"/>

                    <InputGroup.Append>
                      <Button variant="secondary" type="submit">Search</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
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
                    checked={option === radio.value}
                    onChange={(e) => setOption(e.currentTarget.value)}
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
