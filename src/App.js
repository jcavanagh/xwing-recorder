import React from 'react';

import Container from 'react-bootstrap/Container';

import AppStateProvider from './app/state';
import Lobby from './lobby';
import { Login, Logout } from './auth';

function App() {
  return (
    <AppStateProvider>
      <Container fluid={true}>
        <Lobby />
        <Login />
        <Logout />
      </Container>
    </AppStateProvider>
  );
}

export default App;
