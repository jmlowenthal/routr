import React from 'react';

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props)
        this.state = {
            width: props.width,
            height: props.height,
        };
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" width={this.state.width} height={this.state.height}>
                    Your browser doesn't support this functionality
                </canvas>
                <div className="hidden">

                </div>
            </div>
        );
    }

    componentDidMount() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        //const img = this.refs.image;

        requestAnimationFrame(timestep => {
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(10, 10, 50, 50);

            ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
            ctx.fillRect(30, 30, 50, 50);
        });
    }
}

type GameProps = {
    width: number,
    height: number
}

type GameState = {
    width: number,
    height: number,
}
