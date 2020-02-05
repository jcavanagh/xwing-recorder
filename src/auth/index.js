import React, { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import { AppContext } from '../app/state';

export function LoginLogout() {
  const state = useContext(AppContext);

  if (state.user.loading) return null;
  const loggedIn = !!state.user.value;

  return loggedIn ? <Logout /> : <Login />;
}

function Login() {
  const state = useContext(AppContext);

  const handleLoginGoogle = () => {
    state.user.login('google');
  };

  return (
    <>
      <button className="btn btn-block btn-social btn-google" onClick={handleLoginGoogle}>
        <span className="fa fa-google"></span>
        Sign in with Google
      </button>
    </>
  );
}

function Logout() {
  const state = useContext(AppContext);

  const handleLogout = () => {
    state.user.logout();
  };

  return (
    <>
      <Button variant="primary" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}
