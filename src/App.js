import React from 'react';

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import { Router, Link } from '@reach/router';

import AppStateProvider from './app/state';

import { LoginLogout } from './auth';
import Game from './game';
import Lobby from './lobby';

function AppNav() {
  return (
    <Navbar fixed='top' bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand href='/'>X-Wing Recorder</Navbar.Brand>
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
      <Router style={{ height: '100%' }}>
        <Lobby path='/' />
        <Game path='game/:gameId' />
      </Router>
    </AppStateProvider>
  );
}

export default App;
