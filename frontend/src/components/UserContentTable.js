import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'react';
import {host} from '../constants';
import {useParams} from 'react-router';

function UserContentTable({start, end}) {
  const {userId} = useParams();
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/content_table?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const contentData = await res.json();
      console.log('contentData', contentData);
      setContentData(contentData);
    }

    getData();
  }, [start, end, userId]);

  return (
    <>
      <Card.Header>Content Info</Card.Header>
      <Table hover bordered className="mb-0">
        <thead>
        <tr>
          <th>Content ID</th>
          <th>Title</th>
          <th>Device</th>
        </tr>
        </thead>
        <tbody>

        {contentData.map(row => (
          <tr>
            {Object.values(row).map(rowValue => <td>{rowValue}</td>)}
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}

export default UserContentTable;