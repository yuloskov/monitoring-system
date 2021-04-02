import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import {host, primary} from '../constants';
import Spinner from 'react-bootstrap/Spinner';


function UserInfo({start, end}) {
  const {contentId} = useParams();
  const [title, setTitle] = useState('');


  useEffect(() => {
    async function getInfo() {
      const res = await fetch(`${host}/api/content_board/metrics/info?content_id=${contentId}`);
      const title = await res.json();
      setTitle(title);
    }

    getInfo();
  }, [start, end, contentId]);


  if (!title) {
    return (
      <div className="mt-5 mb-5">
        <Spinner animation="border" role="status" variant="secondary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Card.Header style={{color: '#fff'}}>Content info</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
        <thead>
        <tr>
          <th>Content ID</th>
          <th>Title</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{contentId}</td>
          <td>{title}</td>
        </tr>
        </tbody>
      </Table>
    </>
  );
}

export default UserInfo;