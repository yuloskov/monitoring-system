import './css/ControlPanel.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link';


function ControlPanel() {
  return (
    <>
      <div className="panel">
        <Container>
          <Row style={{padding: '10px'}}>
            <Link to="/map" style={{width: '100%'}}>
              <Button block>Map</Button>
            </Link>
          </Row>
          <Row style={{padding: '10px'}}>
            <Link to="/user_board" style={{width: '100%'}}>
              <Button block>User Board</Button>
            </Link>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ControlPanel;