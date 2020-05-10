import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import GamesPanel from '../lobby/GamesPanel';

// import firebase from '@firebase/testing';
// const firebase = require('@firebase/testing');

// const firebaseApp = firebase.initializeTestApp({
//   databaseName: 'xwing-recorder',
//   projectId: 'xwing-recorder',
//   auth: { uid: 'TheTestUser' }
// });

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('CreateGame only if logged in', () => {
  test('disabled if not logged in', () => {
    const { getByText } = render(<GamesPanel user={null} games={[]} createGame={null} />);
    expect(getByText('Login to Create a Game')).toBeDisabled();
  });
  test('enabled if logged in', () => {
    const { getByText } = render(<GamesPanel user={'some_uid'} games={[]} createGame={null} />);
    expect(getByText('New Game')).not.toBeDisabled();
  });
  test('CreateGame parses arguments', () => {
    const createGame = jest.fn();
    const { getByText } = render(<GamesPanel user={'some_uid'} games={[]} createGame={createGame} />);
    fireEvent.click(getByText('New Game'));
    expect(getByText('Create a New Game')).toBeTruthy();
    fireEvent.click(getByText('Create Game'));
    expect(createGame.mock.calls).toHaveLength(1);
  });
});

function CreateGame(id, players, name, maxPlayers) {}
