import React, { useContext, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import { AppContext } from '../app/state';

function CreateGameModal({ createGame }) {
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Form state
  const [name, setName] = useState('');
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

// A realtime game lobby
// Create, join, or view a list of games here
export default function Lobby() {
  const state = useContext(AppContext);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <CreateGameModal createGame={state.games.create}/>
          <GameList games={state.games} />
        </Col>
      </Row>
    </Container>
  )
}