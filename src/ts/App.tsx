import React from 'react';
import { Game } from './Game';
import '../css/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Routr</h1> 
        </header>
        <Game width={300} height={300}/>
      </div>
    );
  }
}

export default App;
