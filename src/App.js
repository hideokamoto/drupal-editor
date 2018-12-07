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
            Example Drupal Decoupled Application
          </p>
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
