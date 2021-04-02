import React, { useState } from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import { bglightcolor, OPTION_BUFF, OPTION_QUALITY } from '../constants';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link, useParams } from 'react-router-dom';
import { DateTimePicker, Combobox } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from './patchedMomentLocalizer';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Route, useHistory } from 'react-router-dom';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';

Moment.locale('en');
momentLocalizer();

function ControlPanel({ setStart, end, setEnd }) {
  const { option = OPTION_QUALITY, userId, contentId } = useParams()
  const history = useHistory()
  const [formUserId, setFormUserId] = useState(userId)
  const [formContentId, setFormContentId] = useState(contentId)
  const timeIntervals = [
    { id: 15 * 60, name: '15 min'},
    { id: 30 * 60, name: '30 min'},
    { id: 45 * 60, name: '45 min'},
    { id: 60 * 60, name: '1 hour'},
    { id: 90 * 60, name: '1.5 hour'},
    { id: 120 * 60, name: '2 hours'},
    { id: 180 * 60, name: '3 hours'},
  ]
  const [interval, setInterval] = useState(timeIntervals[3])

  const radios = [
    { name: 'Mean Buff Time', value: OPTION_BUFF },
    { name: 'Mean Quality', value: OPTION_QUALITY },
  ];

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target)
    let url = ''
    if (window.location.pathname.includes('/user_board')) {
      const userId = formData.get('user_id');
      url = `/user_board/${userId}`
    } else { 
      const contentId = formData.get('content_id');
      url = `/content_board/${contentId}`
    }
    history.push(url)

  }

  function selectOption(option) {
    history.push(`/map/${option}`)
  }

  function changeInterval(x) {
    if (typeof x === 'object') {
      setInterval(x)
      setStart(new Date(end - x.id * 1000))
    }
  }

  function changeDate(x) {
    setEnd(x)
    setStart(new Date(x - interval.id * 1000))
  }

  return (
    <>
      <div className="min-vh-100 h-100" style={{ backgroundColor: '#1d1f23' }}>
        <Container bg='primary'>
          <Row style={{ padding: '10px' }}>
            <Link to="/map" style={{ width: '100%' }}>
              <Button block variant='secondary'>Map</Button>
            </Link>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Link to="/user_board" style={{ width: '100%' }}>
              <Button block variant='secondary'>User Board</Button>
            </Link>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Link to="/content_board" style={{ width: '100%' }}>
              <Button block variant='secondary'>Content Board</Button>
            </Link>
          </Row>
          <hr style={{ background: '#e00a1e' }} />

          <Row style={{ padding: '10px' }}>
            <Route path="/user_board/:userId?">
              <div className="mb-1">
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="text"
                      name="user_id"
                      placeholder="User id"
                      style={{ backgroundColor: bglightcolor, borderColor: bglightcolor, color: '#fff' }}
                      value={formUserId}
                      onChange={(e) => setFormUserId(e.currentTarget.value)}
                    />
                    <InputGroup.Append>
                      <Button variant="secondary" type="submit">Search</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </div>
            </Route>
            <Route path="/content_board/:userId?">
              <div className="mb-1">
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="text"
                      name="content_id"
                      placeholder="Content id"
                      style={{ backgroundColor: bglightcolor, borderColor: bglightcolor, color: '#fff' }}
                      value={formContentId}
                      onChange={(e) => setFormContentId(e.currentTarget.value)}
                    />
                    <InputGroup.Append>
                      <Button variant="secondary" type="submit">Search</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </div>
            </Route>
            <div className="mb-1">
              <div style={{ color: '#ffffff' }}>Range end</div>
              <DateTimePicker value={end} onChange={changeDate} />
            </div>
            <div className="mb-1">
              <div style={{ color: '#ffffff' }}>Range length</div>
              <Combobox textField='name' dataKey='id' data={timeIntervals} width='100%' onChange={changeInterval} value={interval.name}/>
            </div>
          </Row>

          <Route path="/map">
            <Row style={{ paddingLeft: '10px' }}>
              <div style={{ color: '#ffffff' }} className="w-100">Options</div>
            </Row>

            <Row style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <ButtonGroup toggle vertical className="w-100">
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={option === radio.value}
                    onChange={(e) => selectOption(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Row>
          </Route>
        </Container>
      </div>
    </>
  );
}

export default ControlPanel;
