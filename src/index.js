import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';

// import App from './App';
import { MDashboard } from './Dials';

firebase.initializeApp({
  apiKey: 'AIzaSyD70wzmPf0nji-tlI5PMS2XniPCuf0D9BM',
  authDomain: 'xwing-recorder.firebaseapp.com',
  databaseURL: 'https://xwing-recorder.firebaseio.com',
  projectId: 'xwing-recorder',
  storageBucket: 'xwing-recorder.appspot.com',
  messagingSenderId: '308419223293',
  appId: '1:308419223293:web:5baedcca90074814eae894',
  measurementId: 'G-WH9BPRDX4K'
});

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<MDashboard />, document.getElementById('root'));
