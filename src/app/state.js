import React from 'react';
import firebase from 'firebase/app';
import uuidv4 from 'uuid/v4';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useList, useObjectVal, useListVals } from 'react-firebase-hooks/database';

// Global application state
export const AppContext = React.createContext();

// Auth providers
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const authProviders = {
  google: {
    login: function() {
      firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
        return {
          user: result.user,
          token: result.credential.accessToken
        }
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        // TODO: Handle errors
      });
    }
  }
}

// A provider component for our application state, which injects context data via Firebase pub/sub
export default function(props) {
  // Firebase refs
  const gamesRef = firebase.database().ref('games');
  const presenceRef = firebase.database().ref('presence');

  // State hooks
  const [user, userLoading, userError] = useAuthState(firebase.auth());
  const [users, usersLoading, usersError] = useObjectVal(presenceRef);
  const [connected, connectedLoading, connectedError] = useObjectVal(firebase.database().ref('.info/connected'));
  const [games, gamesLoading, gamesError] = useList(gamesRef);

  // Record presence if we are logged in
  if(user && !connectedLoading) {
    presenceRef.update({
      [user.uid]: {
        connected,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    });
  }

  const logout = function() {
    firebase.auth().signOut().then(function() {
      presenceRef.delete()
    }).catch(function(error) {
      // An error happened.
    });
  };

  return (
    <AppContext.Provider value={{
      user: {
        value: user,
        loading: userLoading,
        error: userError,

        login: (provider) => {
          authProviders[provider].login();
        },
        logout: () => {
          logout();
        },
      },
      users: {
        value: users && Object.entries(users).reduce((all, [k, v]) => {
          all.push(v);
          return all;
        }, []),
        loading: usersLoading,
        error: usersError
      },
      connected,
      games: {
        value: games?.values() ?? [],
        loading: gamesLoading,
        error: gamesError,

        create: ({ name, players, isPrivate }) => {
          const id = uuidv4();
          console.log(`Create game: id=${id}, name=${name}, players=${players}, private=${isPrivate}`)
          gamesRef.update({
            [id]: {
              id,
              name,
              players,
              isPrivate,
              owner: user?.uid ?? null
            }
          });
        }
      }
    }}>
      {props.children}
    </AppContext.Provider>
  );
}
