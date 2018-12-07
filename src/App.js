import React, { Component } from 'react';
import './App.css';

// components
import ReactEditor from './Editor';
import ReactViewer from './Viewer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
        <main className="main">
          <ReactViewer />
          <ReactEditor />
        </main>
      </div>
    );
  }
}

export default App;
