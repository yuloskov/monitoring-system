import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import {host, primary} from '../constants';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function UserInfo({start, end}) {
  const {userId} = useParams();
  const [systemInfo, setSystemInfo] = useState([]);
  const [city, setCity] = useState();
  const [kpi, setKpi] = useState();

  useEffect(() => {
    async function getUserData() {
      const res = await fetch(`${host}/api/user_board/metrics/info?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const userData = await res.json();
      const ip = userData.length > 0 ? userData[0].request_ip : null;
      if (ip !== null) {
        try {
          const location_response = await fetch(`${host}/api/ip_to_city?ip=${ip}`);
          setCity((await location_response.json()).city);
        } catch (error) {
          setCity('');
        }
        console.log(city);
      }
      setSystemInfo(userData.map(({user_os, user_os_version, user_browser, user_browser_version, device_type, request_ip}) => {
        return [[user_os, user_os_version].join(' '), [user_browser, user_browser_version].join(' '), device_type, request_ip];
      }));
    }

    getUserData();

  }, [userId, start, end, city]);

  useEffect(() => {
    async function getUserKPI() {
      const res = await fetch(`${host}/api/user_board/metrics/kpi?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      const kpi = await res.json();
      console.log(kpi);
      setKpi(kpi);
    }
    console.log(systemInfo)

    getUserKPI();

  }, [userId, start, end]);

  const renderTooltip = (props) => (
    <Tooltip id="bbq-tooltip" {...props}>
      Metrics that is accounting buffering time, buffering frequency and quality.
    </Tooltip>
  );

  if (!systemInfo) {
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
      <Card.Header style={{color: '#fff'}}>User info</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
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
          <td>{city}</td>
        </tr>
        </tbody>
      </Table>

      <Card.Header style={{color: '#fff'}}>System info</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
        <thead>
        <tr>
          <th>OS</th>
          <th>Browser</th>
          <th>Device</th>
          <th>ip</th>
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

      <Card.Header style={{color: '#fff'}}>General metrics</Card.Header>
      <Table hover bordered className="mb-0" style={{backgroundColor: primary, color: '#fff'}}>
        <thead>
        <tr>
          <th>Metric Name</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>

        <OverlayTrigger
          placement="top"
          delay={{show: 250, hide: 400}}
          overlay={renderTooltip}
        >
          <tr>
            <td><b>BBQ</b></td>
            <td><b>{kpi ? kpi[3].toFixed(2) : 'Loading...'}</b></td>
          </tr>
        </OverlayTrigger>

        </tbody>
      </Table>
    </>
  );
}

export default UserInfo;