import React from 'react';
import Game from './game/Game';

export class GameContainer extends React.Component<GameProps> {
    private game: Game;
    private animationFrame?: number;
    private animationCallback = (ts: number) => {};

    constructor(props: GameProps) {
        super(props);

        this.update = this.update.bind(this);
        this.game = new Game();
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" width={this.props.width} height={this.props.height} onClick={this.handleClick.bind(this)}>
                    Your browser doesn't support this functionality
                </canvas>
                <div className="hidden">

                </div>
            </div>
        );
    }

    getCanvas(): HTMLCanvasElement {
        return this.refs.canvas as HTMLCanvasElement;
    }

    handleClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        this.game.handleClick(e.clientX - this.getCanvas().offsetLeft, e.clientY - this.getCanvas().offsetTop);
    }

    update() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        //const img = this.refs.image;
        const width = this.props.width;
        const height = this.props.height;

        if (this.animationFrame !== undefined) {
            cancelAnimationFrame(this.animationFrame);
        }

        this.animationCallback = timestamp => {
            this.game.update(timestamp, ctx, width, height);
            this.animationFrame = requestAnimationFrame(this.animationCallback);
        }
        this.animationFrame = requestAnimationFrame(this.animationCallback);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }
}

type GameProps = {
    width: number,
    height: number
}
