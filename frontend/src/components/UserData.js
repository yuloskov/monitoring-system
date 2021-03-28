import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function UserData() {
  return (
    <>
      <Card.Header>User data</Card.Header>
      <Table bordered hover>
        <tbody>
        <tr>
          <th>UUID</th>
          <td>1235</td>
        </tr>
        <tr>
          <th>Session ID</th>
          <td>Thornton</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>Online</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>Innopolis</td>
        </tr>
        </tbody>
      </Table>
    </>
  );
}

export default UserData;