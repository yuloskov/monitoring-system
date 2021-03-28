import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './theme.scss'


import Map from './components/Map';
import MyNavbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import UserBoard from './components/UserBoard';

function App() {
  const [end, setEnd] = useState(new Date('2021-03-15T20:00:00'));
  const start = new Date(end - 3600000)

  return (
    <div className="App" style={{backgroundColor: '#313134'}}>
      <Router>
        <MyNavbar/>
        <Container fluid style={{paddingLeft: 0}}>
          <Row syle={{marginRight: 0}}>
            <Col xs={2} style={{paddingRight: 0}}>
              <ControlPanel start={start} end={end} setEnd={setEnd}/>
            </Col>

            <Col style={{paddingLeft: 0}}>
              <Route path="/map">
                <Map start={start} end={end}/>
              </Route>
              <Route path="/user_board">
                <UserBoard/>
              </Route>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;
