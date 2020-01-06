import React from 'react';
import firebase from 'firebase/app';
import uuidv4 from 'uuid/v4';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useList, useObjectVal } from 'react-firebase-hooks/database';

// Global application state
export const AppContext = React.createContext();

// A provider component for our application state, which injects context data via Firebase pub/sub
export default function(props) {
  const [user, userLoading, userError] = useAuthState(firebase.auth());
  const [connected] = useObjectVal(firebase.database().ref('.info/connected'));
  const [games, gamesLoading, gamesError] = useList(firebase.database().ref('games'));

  return (
    <AppContext.Provider value={{
      user: {
        value: user,
        loading: userLoading,
        error: userError,

        login: () => {},
        logout: () => {},
      },
      connected,
      games: {
        value: games?.values() ?? [],
        loading: gamesLoading,
        error: gamesError,

        create: ({ name, isPrivate }) => {
          const id = uuidv4();
          console.log(`Create game: id=${id}, name=${name}, private=${isPrivate}`)
          games.update({
            [id]: {
              id,
              name,
              isPrivate
            }
          });
        }
      }
    }}>
      {props.children}
    </AppContext.Provider>
  );
}
