export interface Icon {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, selected: SelectionState): void;
}

export enum SelectionState {
    UNSELECTED,
    HOVERED_UNSELECTED,
    HOVERED_SELECTED,
    SELECTED,
}