import Navbar from 'react-bootstrap/Navbar';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';


function MyNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Link to='/'><Navbar.Brand><img src={logo}/> metrics</Navbar.Brand></Link>
    </Navbar>
  );
}

export default MyNavbar;