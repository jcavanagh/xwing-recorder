import React, { useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import { AppContext } from '../app/state';
import GamesPanel from '../lobby/GamesPanel';

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
  const state = useContext(AppContext);

  return (
    <Container fluid={true} style={{ height: '100%', paddingTop: '70px', paddingBottom: '15px' }}>
      <Row style={{ height: '100%' }}>
        <Col>
          <GamesPanel user={state.user?.value?.uid} createGame={state.games.create} />
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
