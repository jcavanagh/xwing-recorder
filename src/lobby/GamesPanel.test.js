import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import GamesPanel from '../lobby/GamesPanel';
import { realtimeDatabase, setFirebaseInstance } from '../app/FirebaseUtil';
import uuidv4 from 'uuid/v4';

const firebase = require('@firebase/testing');
setFirebaseInstance(firebase.initializeTestApp({ projectId: 'test-project', databaseName: 'my-database', auth: null }));

function insertGame(name) {
  const id = uuidv4();
  return realtimeDatabase()
    .ref('games')
    .update({
      [id]: {
        id,
        name: name,
        timestamp: Date.now(),
        maxPlayers: 2,
        isPrivate: false
      }
    });
}

// TODO(hurwitz): Figure out how to reset the database at the start of each test.
beforeAll(async () => {
  // TODO(hurwitz): Add a few games
  await insertGame('test_game');
});

// The GamesList will re-render once the DB query finishes, which makes the test framework grumpy.
async function renderAndWait(component) {
  let result = render(component);
  await waitFor(() => result.getByText('test_game'));
  return result;
}

describe('CreateGame only if logged in', () => {
  test('disabled if not logged in', async () => {
    const { getByText } = await renderAndWait(<GamesPanel user={null} createGame={null} />);
    expect(getByText('Login to Create a Game')).toBeDisabled();
  });
  test('enabled if logged in', async () => {
    const { getByText } = await renderAndWait(<GamesPanel user={'some_uid'} createGame={null} />);
    expect(getByText('New Game')).not.toBeDisabled();
  });
  test('CreateGame parses arguments', async () => {
    const createGame = jest.fn();
    const { getByText } = await render(<GamesPanel user={'some_uid'} createGame={createGame} />);
    fireEvent.click(getByText('New Game'));
    expect(getByText('Create a New Game')).toBeTruthy();
    fireEvent.click(getByText('Create Game'));
    expect(createGame.mock.calls).toHaveLength(1);
  });
});

describe('GamesList Tests', () => {
  test('DisplaysAllGames', async () => {
    const { getByText } = await renderAndWait(<GamesPanel user={null} createGame={null} />);
    await act(async () => {
      await insertGame('game2');
      await waitFor(() => getByText('game2'));
    });
  });
});
