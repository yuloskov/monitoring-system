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
      <div>
        <Router>
          <MyNavbar/>
          <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
            <Row>
              <Col xs={3}>
                <ControlPanel/>
              </Col>
              <Col>
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

      {/*  <Router>*/}
      {/*  <div>*/}
      {/*    <ul>*/}
      {/*      <li>*/}
      {/*        <Link to="/">Home</Link>*/}
      {/*      </li>*/}
      {/*      <li>*/}
      {/*        <Link to="/about">About</Link>*/}
      {/*      </li>*/}
      {/*      <li>*/}
      {/*        <Link to="/dashboard">Dashboard</Link>*/}
      {/*      </li>*/}
      {/*    </ul>*/}

      {/*    <hr />*/}

      {/*    /!**/}
      {/*      A <Switch> looks through all its children <Route>*/}
      {/*      elements and renders the first one whose path*/}
      {/*      matches the current URL. Use a <Switch> any time*/}
      {/*      you have multiple routes, but you want only one*/}
      {/*      of them to render at a time*/}
      {/*    *!/*/}
      {/*    <Switch>*/}
      {/*      <Route exact path="/">*/}
      {/*        <Home />*/}
      {/*      </Route>*/}
      {/*      <Route path="/about">*/}
      {/*        <About />*/}
      {/*      </Route>*/}
      {/*      <Route path="/dashboard">*/}
      {/*        <Dashboard />*/}
      {/*      </Route>*/}
      {/*    </Switch>*/}
      {/*  </div>*/}
      {/*</Router>*/}
    </div>
  );
}


// function Home() {
//   return (
//     <div>
//       <h2>Home</h2>
//     </div>
//   );
// }
//
// function About() {
//   return (
//     <div>
//       <h2>About</h2>
//     </div>
//   );
// }
//
// function Dashboard() {
//   return (
//     <div>
//       <h2>Dashboard</h2>
//     </div>
//   );
// }

export default App;
