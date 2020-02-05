import React, { useContext, useState } from 'react';
import { navigate } from '@reach/router';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Media from 'react-bootstrap/Media';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import { AppContext } from '../app/state';
import { useHover } from '../util/hooks';

import { Chat } from '../chat';
import { UserImage } from '../user';

function UserWidget({ user }) {
  if (!user) {
    return null;
  }

  return (
    <Media style={{ border: '1px solid #CCC', borderRadius: '5px', background: '#EEE' }}>
      <UserImage user={user} />
      <Media.Body>
        <span className="align-middle">{user.displayName}</span>
      </Media.Body>
    </Media>
  );
}

function CreateGameModal({ createGame }) {
  const { user } = useContext(AppContext);

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
      {user?.value?.uid ? (
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
                onChange={e => setMaxPlayers(e.target.value)}
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

function GameList({ games }) {
  return games?.map(game => <GameListItem game={game} />) ?? null;
}

function UsersList({ users }) {
  if (!users || !users.list) {
    return null;
  }

  return (
    <>
      {users.list.map(user => (
        <div key={user.uid}>
          <UserWidget user={user} />
        </div>
      ))}
    </>
  );
}

function GamesPanel() {
  const state = useContext(AppContext);

  return (
    <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>Games</Navbar.Brand>
        <Navbar.Collapse />
        <Form inline onSubmit={e => e.preventDefault()}>
          <CreateGameModal createGame={state.games.create} />
        </Form>
      </Navbar>
      <GameList games={state.games.value} />
    </div>
  );
}

function UsersPanel() {
  const state = useContext(AppContext);

  return (
    <>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>Online Users</Navbar.Brand>
      </Navbar>
      <UsersList users={state.users} />
    </>
  );
}

function ChatPanel() {
  return (
    <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>Lobby Chat</Navbar.Brand>
      </Navbar>
      <Chat style={{ paddingTop: '56px' }} />
    </div>
  );
}

// A realtime game lobby
// Create, join, or view a list of games here
export default function Lobby() {
  return (
    <Container fluid={true} style={{ height: '100%', paddingTop: '70px', paddingBottom: '15px' }}>
      <Row style={{ height: '100%' }}>
        <Col>
          <GamesPanel />
        </Col>
        <Col xs={4}>
          <ChatPanel />
        </Col>
        <Col xs={2}>
          <UsersPanel />
        </Col>
      </Row>
    </Container>
  );
}
