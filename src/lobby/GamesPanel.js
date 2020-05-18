import React, { useState } from 'react';
import { navigate } from '@reach/router';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import { useListVals } from 'react-firebase-hooks/database';

import { useHover } from '../util/hooks';
import { realtimeDatabase } from '../app/FirebaseUtil';

function CreateGameModal({ user, createGame }) {
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Form state
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isPrivate, setIsPrivate] = useState(true);

  const handleCreate = () => {
    const gameId = createGame({
      name,
      maxPlayers,
      isPrivate
    });

    setShow(false);
    navigate(`/game/${gameId}`);
  };

  return (
    <>
      {user ? (
        <Button variant="primary" onClick={handleShow}>
          New Game
        </Button>
      ) : (
        <Button variant="primary" disabled>
          Login to Create a Game
        </Button>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Game</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type="text" placeholder="Game Name" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Max Players"
                value={maxPlayers}
                onChange={e => setMaxPlayers(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Private Game"
                value={isPrivate}
                onChange={e => setIsPrivate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function GameListItem({ game }) {
  const [hoverRef, isHovered] = useHover();

  const background = isHovered ? '#EEE' : 'none';
  const cursor = isHovered ? 'pointer' : 'default';

  const playerCount = Object.keys(game.players ?? {}).length;

  return (
    <Row
      ref={hoverRef}
      key={game.id}
      noGutters
      style={{ padding: '15px', border: '1px solid #CCC', borderRadius: '5px', background, cursor }}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <Col xs={8}>
        <span>{game.name}</span>
      </Col>
      <Col xs={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        Players: {playerCount}/{game.maxPlayers}
      </Col>
    </Row>
  );
}

function GameList() {
  const gamesRef = realtimeDatabase().ref('games');
  const [games /*, gamesLoading, gamesError*/] = useListVals(gamesRef);
  return games?.map(game => <GameListItem game={game} />);
}

export default function GamesPanel({ user, games, createGame }) {
  return (
    <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>Games</Navbar.Brand>
        <Navbar.Collapse />
        <Form inline onSubmit={e => e.preventDefault()}>
          <CreateGameModal user={user} createGame={createGame} />
        </Form>
      </Navbar>
      <GameList games={games} />
    </div>
  );
}
