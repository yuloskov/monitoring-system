import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

function MyNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="#home" className="mr-auto">START metrics</Navbar.Brand>

      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
        <Button variant="outline-light">Search</Button>
      </Form>
    </Navbar>
  );
}

export default MyNavbar;