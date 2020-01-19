import { Position } from "../types";

export default abstract class InteractionManager {
    abstract handleClick(pos: Position): InteractionManager;
    
    handleMouseMove(pos?: Position): InteractionManager {
        return this;
    }

    draw(ctx: CanvasRenderingContext2D): void {};
}