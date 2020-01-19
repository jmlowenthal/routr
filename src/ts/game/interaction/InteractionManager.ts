export default abstract class InteractionManager {
    abstract handleClick(x: number, y: number): InteractionManager;
    abstract handleMouseMove(x: number, y: number): InteractionManager;
    abstract handleMouseOut(): InteractionManager;

    draw(ctx: CanvasRenderingContext2D): void {};
}