import React, { useEffect } from 'react';
import firebase from 'firebase';
import uuidv4 from 'uuid/v4';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useObjectVal, useListVals } from 'react-firebase-hooks/database';

// Global application state
export const AppContext = React.createContext({});

// Auth providers
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const authProviders: { [key: string]: any } = {
  google: {
    login: function() {
      firebase
        .auth()
        .signInWithPopup(googleAuthProvider)
        .then(function(result) {
          return {
            user: result.user
          };
        })
        .catch(function(error) {
          // TODO: Handle errors
        });
    }
  }
};

// Local state blob
// This could probably be something a little more full-featured in the future
const local = {};

// A provider component for our application state, which injects context data via Firebase pub/sub
export default function(props: any) {
  // Firebase refs
  const gamesRef = firebase.database().ref('games');
  const presenceRef = firebase.database().ref('presence');
  const lobbyChatRef = firebase.database().ref('lobby/chat');

  // State hooks
  const [user, userLoading, userError] = useAuthState(firebase.auth());
  const [users, usersLoading, usersError] = useListVals(presenceRef);
  const [connected] = useObjectVal(firebase.database().ref('.info/connected'));
  const [games, gamesLoading, gamesError] = useListVals(gamesRef);
  const [lobbyChat, lobbyChatLoading, lobbyChatError] = useListVals(lobbyChatRef);

  // Extracted state mutators
  const joinGame = (id: string) => {
    gamesRef
      .child(id)
      .child('players')
      .child(user!.uid)
      .child('user')
      .update({
        uid: user!.uid,
        photoURL: user!.photoURL,
        displayName: user!.displayName
      });
  };

  // Record presence if we are logged in
  useEffect(() => {
    if (user) {
      presenceRef
        .update({
          [user.uid]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        })
        .then(() => {
          presenceRef
            .child(user.uid)
            .onDisconnect()
            .remove();
        });
    }
  }, [user]); // eslint-disable-line

  const userState = {
    value: user,
    loading: userLoading,
    error: userError,

    login: (provider: string) => {
      authProviders[provider].login();
    },
    logout: () => {
      presenceRef
        .child(user!.uid)
        .remove()
        .then(() => {
          return firebase
            .auth()
            .signOut()
            .catch(function(error) {
              // TODO: Error handling
              console.error(error);
            });
        });
    }
  };

  const usersState = {
    list:
      users &&
      Object.entries(users).reduce((all: any[], [k, v]: any) => {
        all.push(v);
        return all;
      }, []),
    byUserId:
      users &&
      Object.entries(users).reduce((all, [k, v]) => {
        // @ts-ignore
        all[v.uid] = v;
        return all;
      }, {}),
    value: users,
    loading: usersLoading,
    error: usersError
  };

  const lobbyState = {
    chat: {
      value: lobbyChat,
      loading: lobbyChatLoading,
      error: lobbyChatError,

      send: (message: string) => {
        if (user) {
          const newMsgRef = lobbyChatRef.push();
          newMsgRef.update({
            uid: user.uid,
            timestamp: Date.now(),
            message,
            photoURL: user.photoURL,
            displayName: user.displayName
          });
        }
      }
    }
  };

  const gamesState = {
    value: games ?? [],
    loading: gamesLoading,
    error: gamesError,

    create: (name: string, maxPlayers: number, isPrivate: boolean) => {
      // Generate an ID, return that
      const id = uuidv4();
      console.log(`Create game: id=${id}, name=${name}, maxPlayers=${maxPlayers}, private=${isPrivate}`);
      gamesRef
        .update({
          [id]: {
            id,
            name,
            timestamp: Date.now(),
            maxPlayers,
            isPrivate
          }
        })
        .then(() => {
          // The creator auto-joins their own game
          joinGame(id);
        });

      return id;
    },

    start: (id: string) => {
      gamesRef.child(id).update({
        isStarted: true
      });
    },

    join: joinGame,

    leave: (id: string) => {
      gamesRef
        .child(id)
        .child('players')
        .child(user!.uid)
        .remove();

      // TODO: Destroy the game if it has no players left
    },

    updateSquad(id: string, squad: any) {
      gamesRef
        .child(id)
        .child('players')
        .child(user!.uid)
        .update({
          squad
        });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user: userState,
        users: usersState,
        connected,
        lobby: lobbyState,
        games: gamesState,
        // Separate bucket for local-only state
        local
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
