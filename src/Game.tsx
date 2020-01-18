import React from 'react';

export class Game extends React.Component<GameProps> {
    constructor(props: GameProps) {
        super(props);

        this.update = this.update.bind(this);
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" width={this.props.width} height={this.props.height}>
                    Your browser doesn't support this functionality
                </canvas>
                <div className="hidden">

                </div>
            </div>
        );
    }

    update() {
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

    componentWillReceiveProps() {
        this.update();
    }

    componentWillUpdate() {
        this.update();
    }
}

type GameProps = {
    width: number,
    height: number
}
