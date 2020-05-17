import React from 'react';
import { cleanup, fireEvent, render, waitForElement } from '@testing-library/react';
import GamesPanel from '../lobby/GamesPanel';
import { realtimeDatabase, setFirebaseInstance } from '../app/FirebaseUtil';
import uuidv4 from 'uuid/v4';

const firebase = require('@firebase/testing');
setFirebaseInstance(firebase.initializeTestApp({ projectId: 'test-project', databaseName: 'my-database', auth: null }));

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

describe('GamesList Tests', () => {
  beforeEach(async () => {
    // TODO(hurwitz): Add a few games
    const id = uuidv4();
    await realtimeDatabase()
      .ref('games')
      .update({
        [id]: {
          id,
          name: 'test_game',
          timestamp: Date.now(),
          maxPlayers: 2,
          isPrivate: false
        }
      });
  });
  test('DisplaysAllGames', async () => {
    const { getByText } = render(<GamesPanel user={null} games={[]} createGame={null} />);
    await waitForElement(() => getByText('test_game'));
  });
});
