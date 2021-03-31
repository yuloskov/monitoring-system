import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function MyNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Link to='/'><Navbar.Brand>START metrics</Navbar.Brand></Link>
    </Navbar>
  );
}

export default MyNavbar;