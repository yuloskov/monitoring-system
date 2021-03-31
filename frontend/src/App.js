import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './theme.scss'


import PointsMap from './components/Map';
import MyNavbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import UserBoard from './components/UserBoard';
import { OPTION_QUALITY } from './constants';

function App() {
  const [end, setEnd] = useState(new Date('2021-03-08T20:00:00'));
  const [option, setOption] = useState(OPTION_QUALITY);
  const start = new Date(end - 3600000)

  return (
    <div className="App" style={{backgroundColor: '#313134'}}>
      <Router>
        <MyNavbar/>
        <Container fluid style={{paddingLeft: 0}}>
          <Row syle={{marginRight: 0}}>
            <Col xs={2} style={{paddingRight: 0}}>
              <ControlPanel start={start} end={end} setEnd={setEnd} option={option} setOption={setOption}/>
            </Col>

            <Col style={{paddingLeft: 0}}>
              <Route path="/map">
                <PointsMap start={start} end={end} option={option}/>
              </Route>
              <Route path="/user_board/:userId">
                <UserBoard start={start} end={end} />
              </Route>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;
