import React, { useEffect } from 'react';
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
  const lobbyChatRef = firebase.database().ref('lobby/chat');

  // State hooks
  const [user, userLoading, userError] = useAuthState(firebase.auth());
  const [users, usersLoading, usersError] = useListVals(presenceRef);
  const [connected] = useObjectVal(firebase.database().ref('.info/connected'));
  const [games, gamesLoading, gamesError] = useList(gamesRef);
  const [lobbyChat, lobbyChatLoading, lobbyChatError] = useListVals(lobbyChatRef);

  // Record presence if we are logged in
  useEffect(() => {
    if(user) {
      presenceRef.update({
        [user.uid]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      }).then(() => {
        presenceRef.child(user.uid).onDisconnect().remove();
      })
    }
  }, [user]); // eslint-disable-line 

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
          presenceRef.child(user.uid).remove().then(() => {
            return firebase.auth().signOut().catch(function(error) {
              // TODO: Error handling
              console.error(error);
            });
          });
        },
      },
      users: {
        list: users && Object.entries(users).reduce((all, [k, v]) => {
          all.push(v);
          return all;
        }, []),
        byUserId: users && Object.entries(users).reduce((all, [k, v]) => {
          all[v.uid] = v;
          return all
        }, {}),
        value: users,
        loading: usersLoading,
        error: usersError
      },
      connected,
      lobby: {
        chat: {
          value: lobbyChat,
          loading: lobbyChatLoading,
          error: lobbyChatError,

          send: (message) => {
            if(user) {
              const newMsgRef = lobbyChatRef.push();
              newMsgRef.update({
                userId: user.uid,
                timestamp: Date.now(),
                message
              });
            }
          }
        }
      },
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
