import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function UserData() {
  return (
    <>
      <Card.Header>User info</Card.Header>
      <Table hover>
        <tbody>
        <tr>
          <th>Name</th>
          <td>1aaaa</td>
        </tr>
        <tr>
          <th>UUID</th>
          <td>1235</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>Innopolis</td>
        </tr>
        <tr>
          <th>OS</th>
          <td>sadas</td>
        </tr>
        <tr>
          <th>Browser</th>
          <td>adafd</td>
        </tr>
        </tbody>
      </Table>
    </>
  );
}

export default UserData;