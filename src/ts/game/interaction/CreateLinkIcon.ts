import { Icon, SelectionState } from "./Icon";

export class CreateLinkIcon implements Icon {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, selected: SelectionState): void {
        switch (selected) {
        case SelectionState.UNSELECTED:
            ctx.fillStyle = '#fff5';
            break;
        case SelectionState.HOVERED_UNSELECTED:
            ctx.fillStyle = '#fff8';
            break;
        case SelectionState.HOVERED_SELECTED:
            ctx.fillStyle = '#fffd';
            break;
        case SelectionState.SELECTED:
            ctx.fillStyle = '#fff';
            break;
        }
        ctx.fillRect(x, y, w, h);
    }
}