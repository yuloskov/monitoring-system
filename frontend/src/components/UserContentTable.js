import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'react';
import {host, primary} from '../constants';
import {useParams} from 'react-router';
import './css/table.css';

function UserContentTable({start, end}) {
  const {userId} = useParams();
  const [contentData, setContentData] = useState([]);
  const [actionsData, setActionsData] = useState([]);
  const [selected, setSelected] = useState(-1);

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
    const res = await fetch(`http://${host}/api/user_board/metrics/actions?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}&content_id=${content_id}`);
    const actionsData = await res.json();
    setActionsData(actionsData);
  }

  return (
    <>
      <Card.Header style={{color: '#fff'}}>Content List</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
        <thead>
        <tr>
          <th>Content ID</th>
          <th>Device</th>
        </tr>
        </thead>
        <tbody>

        {contentData.map((row, index) => (
          <ContentRow data={row} setActionsData={setActionsData} loadActions={loadActions} index={index} selected={selected} setSelected={setSelected}/>
        ))}
        </tbody>
      </Table>

      <Card.Header style={{color: '#fff'}}>Content Actions</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
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

function ContentRow({index, data, loadActions, setActionsData, selected, setSelected}) {
  const style = selected === index ? 'selected' : '';

  function handleClick() {
    if (selected === index) {
      setSelected(-1);
      setActionsData([]);
    } else {
      loadActions(data);
      setSelected(index);
    }
  }

  return (
    <tr key={index} onClick={handleClick} className={`table-row ${style}`}>
      {Object.values(data).map((rowValue, j) => <td key={j}>{rowValue}</td>)}
    </tr>
  );
}

export default UserContentTable;