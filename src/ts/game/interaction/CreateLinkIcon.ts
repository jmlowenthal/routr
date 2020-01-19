import { Icon, SelectionState } from "./Icon";
import { TOOLBAR_ICON_SIZE } from "../MagicNumber";

export class CreateLinkIcon implements Icon {
    private img: HTMLImageElement;

    constructor(imageSrc: string) {
        this.img = new Image();
        this.img.src = imageSrc;
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, selected: SelectionState): void {
        switch (selected) {
        case SelectionState.UNSELECTED:
            ctx.fillStyle = '#fff3';
            break;
        case SelectionState.HOVERED_UNSELECTED:
            ctx.fillStyle = '#fff4';
            break;
        case SelectionState.HOVERED_SELECTED:
            ctx.fillStyle = '#ffffff69';
            break;
        case SelectionState.SELECTED:
            ctx.fillStyle = '#ffffff70';
            break;
        }
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(this.img, x + 10, y + 10, TOOLBAR_ICON_SIZE - 20, TOOLBAR_ICON_SIZE - 20);
    }
}