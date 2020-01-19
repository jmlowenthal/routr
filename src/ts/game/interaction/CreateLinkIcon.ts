import { Icon } from "./Icon";

export class CreateLinkIcon implements Icon {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, selected: boolean): void {
        ctx.fillStyle = selected ? "#fff" : "#fff5";
        ctx.fillRect(x, y, w, h);
    }
}