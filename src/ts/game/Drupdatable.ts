import Game from "./Game";
import { Position } from "./types";

export default abstract class Drupdatable {
    update(dt: number, game: Game) { }
    draw(ctx: CanvasRenderingContext2D) { }
    zIndex(): number|undefined {
        return undefined;
    }
    getBoundingBox(): [number, number, number, number] {
        return [-1, -1, -1, -1];
    }
    inside(pos: Position): boolean {
        let boundingBox = this.getBoundingBox();
        return boundingBox[0] <= pos.x && pos.x <= boundingBox[2] &&
            boundingBox[1] <= pos.y && pos.y <= boundingBox[3];
    }
    scoreUpdate(): number {
        return 0;
    }
    gameOver(): boolean {
        return false;
    }
}