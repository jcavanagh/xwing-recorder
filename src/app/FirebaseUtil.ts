import firebase from 'firebase';

let firebaseInstance: firebase.app.App | null = null;

export function realtimeDatabase(): firebase.database.Database {
  return firebaseInstance?.database() ?? firebase.database();
}

export function setFirebaseInstance(instance: firebase.app.App) {
  firebaseInstance = instance;
}
