import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import {host} from '../constants';

function UserInfo({start, end}) {
  const {userId} = useParams();
  const [systemInfo, setSystemInfo] = useState([]);

  useEffect(() => {
    async function getUserData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/info?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const userData = await res.json();
      setSystemInfo(userData.map(({user_os, user_os_version, user_browser, user_browser_version, device_type}) => {
        return [[user_os, user_os_version].join(' '), [user_browser, user_browser_version].join(' '), device_type];
      }));
    }

    getUserData();

  }, [userId, start, end]);


  if (!systemInfo) {
    return <h1>Loading</h1>;
  }

  return (
    <>
      <Card.Header>User info</Card.Header>
      <Table hover bordered className="mb-0">
        <tbody>
        <tr>
          <th>Name</th>
          <td>Anonymous</td>
        </tr>
        <tr>
          <th>ProfileID</th>
          <td>{userId}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>Innopolis</td>
        </tr>
        </tbody>
      </Table>

      <Card.Header>System info</Card.Header>
      <Table hover bordered className="mb-0">
        <thead>
        <tr>
          <th>OS</th>
          <th>Browser</th>
          <th>Device</th>
        </tr>
        </thead>
        <tbody>

        {systemInfo.map(row => (
          <tr>
            {Object.values(row).map(rowValue => <td>{rowValue}</td>)}
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}

export default UserInfo;