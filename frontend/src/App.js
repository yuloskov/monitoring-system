import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Map from './components/Map';
import MyNavbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import UserBoard from './components/UserBoard';

function App() {
  return (
    <div className="App">
      <Router>
        <MyNavbar/>
        <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
          <Row>
            <Col xs={2} style={{paddingRight: 0}}>
              <ControlPanel/>
            </Col>

            <Col style={{paddingLeft: 0}}>
              <Route path="/map">
                <Map/>
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
