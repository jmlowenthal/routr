import Game from "../Game";

export default abstract class InteractionManager {
    abstract handleClick(x: number, y: number): InteractionManager;
    draw(ctx: CanvasRenderingContext2D): void {};
}