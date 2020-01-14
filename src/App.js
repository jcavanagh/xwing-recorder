import React from 'react';

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';

import AppStateProvider from './app/state';

import { LoginLogout } from './auth';
import Lobby from './lobby';

function AppNav() {
  return (
    <Navbar fixed='top' bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand href='#'>X-Wing Recorder</Navbar.Brand>
      <Navbar.Collapse id='basic-navbar-nav' />
      <Form inline onSubmit={e => e.preventDefault()}>
        <LoginLogout />
      </Form>
    </Navbar>
  )
}

function App() {
  return (
    <AppStateProvider>
      <AppNav />
      <Lobby />
    </AppStateProvider>
  );
}

export default App;
