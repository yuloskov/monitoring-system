import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function MyNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Link to='/'><Navbar.Brand href="#home" className="mr-auto">START metrics</Navbar.Brand></Link>
    </Navbar>
  );
}

export default MyNavbar;