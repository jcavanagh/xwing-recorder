import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import { AppContext } from '../app/state';

export function Login() {
  const state = useContext(AppContext);
  if (state.user.value) return null;
    
  const handleLoginGoogle = () => {
    state.user.login('google');
  }

  return (
    <>
      <button className="btn btn-block btn-social btn-google" onClick={handleLoginGoogle}>
        <span className="fa fa-google"></span>
        Sign in with Google
      </button>
    </>
  );
}

export function Logout() {
  const state = useContext(AppContext);
  if (state.user.value == null) return null;
  
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
