import React from 'react';

import AppStateProvider from './app/state';
import Lobby from './lobby';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <AppStateProvider>
      <Container fluid={true}>
        <Lobby />
      </Container>
    </AppStateProvider>
  );
}

export default App;
