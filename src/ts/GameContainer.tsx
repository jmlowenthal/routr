import React from 'react';
import Game from './game/Game';

export class GameContainer extends React.Component<GameProps, {gameRunning: boolean, score: number}> {
    private game: Game;
    private animationFrame?: number;
    private animationCallback = (ts: number) => {};
    private mouseIsOver: boolean = false;

    constructor(props: GameProps) {
        super(props);

        this.update = this.update.bind(this);
        this.state = {
            gameRunning: true,
            score: 0,
        };
        this.game = new Game(this.gameOver.bind(this));
    }

    render() {
        if (this.state.gameRunning) {
            return (
                <div>
                    <canvas ref="canvas" width={this.props.width} height={this.props.height} 
                            onClick={this.handleClick.bind(this)} onMouseMove={this.handleMouseMove.bind(this)}
                            onMouseOut={this.handleMouseOut.bind(this)}>
                        Your browser doesn't support this functionality
                    </canvas>
                </div>
            );
        } else {
            return (
                <div className="GameOver">
                    Game Over. You scored {this.state.score}!
                    <div className="GameOver-retry">
                        <button onClick={this.retry.bind(this)}>Try again</button>
                    </div>
                </div>
            )
        }
    }

    getCanvas(): HTMLCanvasElement {
        return this.refs.canvas as HTMLCanvasElement;
    }

    handleClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        this.game.withInteractionManager(im => im.handleClick({
            x: e.clientX - this.getCanvas().offsetLeft,
            y: e.clientY - this.getCanvas().offsetTop,
        }));
    }

    handleMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        this.game.withInteractionManager(im => im.handleMouseMove({
            x: e.clientX - this.getCanvas().offsetLeft,
            y: e.clientY - this.getCanvas().offsetTop
        }));
    }

    handleMouseOut(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        this.game.withInteractionManager(im => im.handleMouseMove(undefined));
    }

    update() {
        if (this.state.gameRunning) {
            const canvas = this.refs.canvas as HTMLCanvasElement;
            const ctx = canvas.getContext("2d")!;
            const width = this.props.width;
            const height = this.props.height;

            if (this.animationFrame !== undefined) {
                cancelAnimationFrame(this.animationFrame);
            }

            this.animationCallback = timestamp => {
                this.game.update(timestamp, ctx, width, height);
                if (this.state.gameRunning) {
                    this.animationFrame = requestAnimationFrame(this.animationCallback);
                } else {
                    this.animationFrame = undefined;
                }
            }
            this.animationFrame = requestAnimationFrame(this.animationCallback);
        }
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    gameOver(score: number) {
        this.setState({
            gameRunning: false,
            score: score,
        });
    }

    retry() {
        this.game = new Game(this.gameOver.bind(this));
        this.setState({
            gameRunning: true,
        });
    }
}

type GameProps = {
    width: number,
    height: number
}
