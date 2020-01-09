import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import { AppContext } from '../app/state';

export function Login() {
  const state = useContext(AppContext);

  const handleLoginGoogle = () => {
    state.user.login('google');
  }

  return (
    <>
      <a className="btn btn-block btn-social btn-google" onClick={handleLoginGoogle} href="javascript:void(0)">
        <span className="fa fa-google"></span>
        Sign in with Google
      </a>
    </>
  );
}

export function Logout() {
  const state = useContext(AppContext);

  const handleLogout = () => {
    state.user.logout();
  }

  return (
    <>
      <Button variant='primary' onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
