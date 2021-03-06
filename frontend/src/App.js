import React, { useState } from 'react';
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
import { bglightcolor } from './constants';
import ScrollUpButton from "react-scroll-up-button";
import ContentBoard from './components/ContentBoard';

function App() {
  const [end, setEnd] = useState(new Date('2021-03-08T20:00:00'));
  const [start, setStart] = useState(new Date('2021-03-08T19:00:00'));

  return (
    <div className="App" style={{ backgroundColor: bglightcolor }}>
      <Router>
        <Container fluid className="pr-0 pl-0">
          <Row className="mr-0">
            <Col className="pr-0">
              <MyNavbar />
            </Col>
          </Row>

          <div>
            <Row className="mr-0">
              <Col xs={2} className="pr-0">
                <Route path={["/user_board/:userId?", "/content_board/:contentId", "/map/:option?", "/"]}>
                  <ControlPanel setStart={setStart} end={end} setEnd={setEnd} />
                </Route>
              </Col>

              <Col className="pl-0">
                <Route path="/map/:option?">
                  <PointsMap start={start} end={end} />
                </Route>
                <Route path="/user_board/:userId">
                  <UserBoard start={start} end={end} />
                </Route>
                <Route path="/content_board/:contentId">
                  <ContentBoard start={start} end={end}/>
                </Route>
              </Col>
            </Row>
          </div>
        </Container>
      </Router>
      <ScrollUpButton
        ContainerClassName="AnyClassForContainer"
        TransitionClassName='AnyClassForTransition'
        EasingType="easeInQuad" />
    </div>
  );
}

export default App;
