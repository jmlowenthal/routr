import { TOOLBAR_ICON_SIZE } from "../MagicNumber";

export enum SelectionState {
    UNSELECTED,
    HOVERED_UNSELECTED,
    HOVERED_SELECTED,
    SELECTED,
}

export class Icon {
    private img: HTMLImageElement;

    constructor(imageSrc: string, private remainingCount?: () => number) {
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

        if (this.remainingCount) {
            ctx.save();
            let count = this.remainingCount();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 30, y);
            ctx.lineTo(x, y + 30);
            ctx.closePath();
            ctx.fillStyle = '#37393d';
            ctx.fill();
            ctx.font = '14px normal';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.translate(x + 2, y + 10);
            let countStr, newX, newY;
            if (count > 9) {
                countStr = "9+";
                ctx.font = '11px normal';
                ctx.rotate(-Math.PI / 4);
                newY = 0;
                newX = 0;
            } else {
                countStr = count.toString();
                ctx.font = '14px normal';
                newX = 2;
                newY = -7;
            }
            ctx.fillText(countStr, newX, newY);
            
            ctx.restore();
        }
    }
}
