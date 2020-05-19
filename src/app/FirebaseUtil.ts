// Utilities for making Firebase play well with tests, especially dependency injection.

import firebase from 'firebase';

let firebaseInstance: firebase.app.App | null = null;

// In a test, returns the emulated instance. Otherwise, returns the real version.
export function realtimeDatabase(): firebase.database.Database {
  return firebaseInstance?.database() ?? firebase.database();
}

// Injects the emulated firebase instance. Must be called during test setup
//   const firebase = require('@firebase/testing');
//   setFirebaseInstance(firebase.initializeTestApp(
//       { projectId: 'test-project', databaseName: 'my-database', auth: auth }));
export function setFirebaseInstance(instance: firebase.app.App) {
  firebaseInstance = instance;
}
