import React from 'react';
import { Game } from './Game';
import '../css/App.css';

class App extends React.Component<{}, AppState> {
  constructor(params: {}) {
    super(params);

    this.state = {
      gameWidth: 0,
      gameHeight: 0,  
    };

    this.onResize = this.onResize.bind(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Routr</h1> 
        </header>
        <div ref="game" className="App-game">
        <Game width={this.state.gameWidth} height={this.state.gameHeight}/>
        </div>
      </div>
    );
  }

  onResize() {
    let game = this.refs.game as HTMLElement;
    this.setState({ gameWidth: game.offsetWidth, gameHeight: game.offsetHeight });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
}

type AppState = {
  gameWidth: number,
  gameHeight: number,
};

export default App;
