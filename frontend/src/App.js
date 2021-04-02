import React, {useState} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './theme.scss';


import PointsMap from './components/Map';
import MyNavbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import UserBoard from './components/UserBoard';
import {bglightcolor} from './constants';

function App() {
  const [end, setEnd] = useState(new Date('2021-03-08T20:00:00'));
  const start = new Date(end - 3600000);

  return (
    <div className="App" style={{backgroundColor: bglightcolor}}>
      <Router>
        <Container fluid className="pr-0 pl-0">
          <Row className="mr-0">
            <Col className="pr-0">
              <MyNavbar/>
            </Col>
          </Row>

          <div>
            <Row className="mr-0">
              <Col xs={2} className="pr-0">
                <Route path={["/user_board/:userId?", "/map/:option?", "/"]}>
                  <ControlPanel start={start} end={end} setEnd={setEnd}/>
                </Route>
              </Col>

              <Col className="pl-0">
                <Route path="/map/:option?">
                  <PointsMap start={start} end={end}/>
                </Route>
                <Route path="/user_board/:userId">
                  <UserBoard start={start} end={end}/>
                </Route>
              </Col>
            </Row>
          </div>
        </Container>
      </Router>
    </div>
  );
}

export default App;
