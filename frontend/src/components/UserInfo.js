import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

function UserInfo({ start, end }) {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUserData() {
      console.log(userId, start, end);
      const res = await fetch(`http://localhost:5000/api/user_board/metrics/info?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const userData = await res.json();
      console.log(userData);
      setUserData(userData);
    }

    getUserData()

  }, [userId, start, end])


  if (!userData) {
    return <h1>Loading</h1>
  }

  return (
    <>
      <Card.Header>User info</Card.Header>
      <Table hover>
        <tbody>
        <tr>
          <th>Name</th>
          <td>Anonymous</td>
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

export default UserInfo;