import InteractionManager from "./InteractionManager";
import { Icon, SelectionState } from "./Icon";
import { TOOLBAR_ICON_SIZE } from "../MagicNumber";

export class ToolbarInteractionManager extends InteractionManager {

    private tools: [Icon, InteractionManager][];
    private currentToolIndex: number = -1;
    private currentMousePosition?: {x: number, y: number};

    constructor(tools: [Icon, InteractionManager][]) {
        super();
        this.tools = tools;
    }

    handleClick(x: number, y: number): InteractionManager {
        let i = this.getToolAtPosition(x, y);
        if (i !== null) {
            this.currentToolIndex = this.currentToolIndex !== i ? i : -1;
        }
        else if (this.currentToolIndex >= 0) {
            this.tools[this.currentToolIndex][1] = this.tools[this.currentToolIndex][1].handleClick(x, y);
        }
        return this;
    }

    handleMouseMove(x: number, y: number) {
        this.currentMousePosition = {x, y};
        if (this.currentToolIndex >= 0) {
            this.tools[this.currentToolIndex][1].handleMouseMove(x, y);
        }
        return this;
    }

    handleMouseOut() {
        this.currentMousePosition = undefined;
        if (this.currentToolIndex >= 0) {
            this.tools[this.currentToolIndex][1].handleMouseOut();
        }
        return this;
    }

    getToolAtPosition(x: number, y: number): number|null {
        if (x > TOOLBAR_ICON_SIZE || y > TOOLBAR_ICON_SIZE * this.tools.length) {
            return null;
        }
        return Math.floor(y / TOOLBAR_ICON_SIZE);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.tools.forEach((t, i) => {
            let hovered = this.currentMousePosition !== undefined && 
                    this.getToolAtPosition(this.currentMousePosition.x, this.currentMousePosition.y) === i;
            let state: SelectionState;
            if (this.currentToolIndex === i) {
                if (hovered) {
                    state = SelectionState.HOVERED_SELECTED;
                } else {
                    state = SelectionState.SELECTED;
                }
            } else {
                if (hovered) {
                    state = SelectionState.HOVERED_UNSELECTED;
                } else {
                    state = SelectionState.UNSELECTED;
                }
            }
            t[0].draw(ctx, i, TOOLBAR_ICON_SIZE * i, TOOLBAR_ICON_SIZE, TOOLBAR_ICON_SIZE, state);
        })
    }

}