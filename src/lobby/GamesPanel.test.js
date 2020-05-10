import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import GamesPanel from '../lobby/GamesPanel';

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
