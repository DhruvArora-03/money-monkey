import React from 'react';
import logo from './logo.svg';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyD7ZV1Z3WWLjK9zjgnPbogZeIS9Bq6xJJI',
  authDomain: 'costcamel-b6c02.firebaseapp.com',
  projectId: 'costcamel-b6c02',
  storageBucket: 'costcamel-b6c02.appspot.com',
  messagingSenderId: '725109949838',
  appId: '1:725109949838:web:432a3cce60d9c78fe8d0df',
  measurementId: 'G-YCZ6FFQ0VX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
console.log(analytics);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
