import Game from "./Game";

export default abstract class Drupdatable {
    update(dt: number, game: Game) { }
    draw(ctx: CanvasRenderingContext2D) { }
    getBoundingBox(): [number, number, number, number] {
        return [-1, -1, -1, -1];
    }
}