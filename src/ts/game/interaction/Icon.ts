export interface Icon {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, selected: boolean): void;
}