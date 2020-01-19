import React from 'react';
import { GameContainer } from './GameContainer';
import '../css/App.css';
import Tutorial from './Tutorial';

class App extends React.Component<{}, AppState> {
  constructor(params: {}) {
    super(params);

    this.state = {
      gameWidth: 0,
      gameHeight: 0,
      tutorial: true,
    };

    this.onResize = this.onResize.bind(this);
  }

  render() {
    if (this.state.tutorial) {
      return (
        <div className="App">
          <Tutorial/>
          <div>
            <button onClick={() => this.setState({tutorial: false})}>Continue</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="App">
          <div ref="game" className="App-game">
          <GameContainer width={this.state.gameWidth} height={this.state.gameHeight}/>
          </div>
        </div>
      );
    }
  }

  onResize() {
    this.update();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  update() {
    if (!this.state.tutorial) {
      let game = this.refs.game as HTMLElement;
      if (game.offsetWidth !== this.state.gameWidth || game.offsetHeight !== this.state.gameHeight) {
        this.setState({ gameWidth: game.offsetWidth, gameHeight: game.offsetHeight });
      }
    }
  }
}

type AppState = {
  gameWidth: number,
  gameHeight: number,
  tutorial: boolean,
};

export default App;
