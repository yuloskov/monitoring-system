import Navbar from 'react-bootstrap/Navbar';


function MyNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="#home" className="mr-auto">START metrics</Navbar.Brand>
    </Navbar>
  );
}

export default MyNavbar;