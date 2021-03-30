import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function UserContentTable() {
  return (
    <>
      <Card.Header>Content</Card.Header>
      <Table hover>
        <tbody>
        <tr>
          <th>Name</th>
          <td>1aaaa</td>
        </tr>
        </tbody>
      </Table>
    </>
  );
}

export default UserContentTable;