import React, { useContext, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Media from 'react-bootstrap/Media';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import { AppContext } from '../app/state';

function UserWidget({ user }) {
  if(!user) { return null; }

  return (
    <Media style={{ border: '1px solid #CCC', borderRadius: '5px', background: '#EEE' }}>
      <img
        width={32}
        height={32}
        className="mr-3"
        src={user.photoURL}
        alt={user.displayName}
        style={{ borderRadius: '5px' }}
      />
      <Media.Body>
        <span className="align-middle">{user.displayName}</span>
      </Media.Body>
    </Media>
  );
}

function CreateGameModal({ createGame }) {
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Form state
  const [name, setName] = useState('');
  const [players, setPlayers] = useState(2);
  const [isPrivate, setIsPrivate] = useState(true);

  const handleCreate = () => {
    const ref = createGame({
      name,
      isPrivate
    });

    // TODO: Creation loading UX, close modal when done, then route to game UI
  }

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        New Game
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Game</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Game Name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Players'
                value={players}
                onChange={e => setPlayers(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check 
                type='checkbox'
                label='Private Game'
                value={isPrivate}
                onChange={e => setIsPrivate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>Close</Button>
          <Button variant='primary' onClick={handleCreate}>Create Game</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function GameList({ games }) {
  return (
    <div></div>
  );
}

function UserList({ users }) {
  if(!users || !users.value) { return null; }

  return (
    <>
      {users.value.map(user => 
        <div key={user.uid}>
          <UserWidget user={user} />
        </div>
      )}
    </>
  );
}

// A realtime game lobby
// Create, join, or view a list of games here
export default function Lobby() {
  const state = useContext(AppContext);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <UserWidget />
          <CreateGameModal createGame={state.games.create}/>
          <GameList games={state.games} />
          <UserList users={state.users} />
        </Col>
      </Row>
    </Container>
  )
}
