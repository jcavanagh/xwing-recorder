import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as firebase from 'firebase/app';
import 'firebase/analytics';

import App from './App';

firebase.initializeApp({
  apiKey: 'AIzaSyD70wzmPf0nji-tlI5PMS2XniPCuf0D9BM',
  authDomain: 'xwing-recorder.firebaseapp.com',
  databaseURL: 'https://xwing-recorder.firebaseio.com',
  projectId: 'xwing-recorder',
  storageBucket: 'xwing-recorder.appspot.com',
  messagingSenderId: '308419223293',
  appId: '1:308419223293:web:5baedcca90074814eae894',
  measurementId: 'G-WH9BPRDX4K',
});

ReactDOM.render(<App />, document.getElementById('root'));
