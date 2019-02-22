import React, { Component } from 'react';
import Screen from './Screen.jsx'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Screen/>
        </header>
      </div>
    );
  }
}

export default App;
