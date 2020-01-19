import Game from "./Game";

export default abstract class Drupdatable {
    update(dt: number, game: Game) { }
    draw(ctx: CanvasRenderingContext2D) { }
    getBoundingBox(): [number, number, number, number] {
        return [-1, -1, -1, -1];
    }
    inside(x: number, y: number): boolean {
        let boundingBox = this.getBoundingBox();
        return boundingBox[0] <= x && x <= boundingBox[2] &&
            boundingBox[1] <= y && y <= boundingBox[3];
    }
}