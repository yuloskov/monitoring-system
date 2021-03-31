import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'react';
import {host} from '../constants';
import {useParams} from 'react-router';

function UserContentTable({start, end}) {
  const {userId} = useParams();
  const [contentData, setContentData] = useState([]);
  const [actionsData, setActionsData] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/content_table?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const contentData = await res.json();
      setContentData(contentData);
    }

    getData();
  }, [start, end, userId]);

  async function loadActions(data) {
    const content_id = data[0];

    console.log(content_id)
    const res = await fetch(`http://${host}/api/user_board/metrics/actions?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}&content_id=${content_id}`);
    const actionsData = await res.json();
    setActionsData(actionsData);
  }

  return (
    <>
      <Card.Header>Content List</Card.Header>
      <Table hover bordered className="mb-0">
        <thead>
        <tr>
          <th>Content ID</th>
          <th>Device</th>
        </tr>
        </thead>
        <tbody>

        {contentData.map((row, index) => (
          <ContentRow data={row} index={index} loadActions={loadActions}/>
        ))}
        </tbody>
      </Table>

      <Card.Header>Content Actions</Card.Header>
      <Table hover bordered className="mb-0">
        <thead>
        <tr>
          <th>Server Time</th>
          <th>Action Id</th>
          <th>Action Result</th>
        </tr>
        </thead>
        <tbody>
        {actionsData.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((rowValue, j) => <td key={j}>{rowValue}</td>)}
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}

function ContentRow({index, data, loadActions}) {
  function handleClick() {
    loadActions(data);
  }

  return (
    <tr key={index} onClick={handleClick} style={{cursor:'pointer'}}>
      {Object.values(data).map((rowValue, j) => <td key={j}>{rowValue}</td>)}
    </tr>
  );
}

export default UserContentTable;