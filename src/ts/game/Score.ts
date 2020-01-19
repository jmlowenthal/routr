import Drupdatable from "./Drupdatable";
import Game from "./Game";

export default class Score extends Drupdatable {
    constructor(private game: Game) {
        super();
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#fff3';
        ctx.fillRect(0, 0, 125, 40);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '20px';
        ctx.fillText("Score: " + this.game.getScore(), 10, 22, 105);
    }

    zIndex() {
        return 200;
    }
}