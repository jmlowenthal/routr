import InteractionManager from "./InteractionManager";
import { Icon, SelectionState } from "./Icon";
import { TOOLBAR_ICON_SIZE, TOOLBAR_ICON_SPACING } from "../MagicNumber";
import { Position } from "../types";

export class ToolbarInteractionManager extends InteractionManager {

    private tools: [Icon, InteractionManager, () => boolean][];
    private currentToolIndex: number = -1;
    private currentMousePosition?: Position;

    private static readonly ToolbarOffsetTop = 30 + TOOLBAR_ICON_SPACING;

    constructor(tools: [Icon, InteractionManager, () => boolean][]) {
        super();
        this.tools = tools;
    }

    handleClick(pos: Position): InteractionManager {
        let i = this.getToolAtPosition(pos);
        if (i !== null) {
            this.currentToolIndex = this.currentToolIndex !== i ? i : -1;
        }
        else if (this.currentToolIndex >= 0 && this.tools[this.currentToolIndex][2]()) {
            this.tools[this.currentToolIndex][1] = this.tools[this.currentToolIndex][1].handleClick(pos);
        }
        return this;
    }

    handleMouseMove(pos?: Position) {
        this.currentMousePosition = pos;
        if (this.currentToolIndex >= 0) {
            this.tools[this.currentToolIndex][1].handleMouseMove(pos);
        }
        return this;
    }

    getToolAtPosition(pos: Position): number|null {
        let y = pos.y - ToolbarInteractionManager.ToolbarOffsetTop;
        if (pos.x > TOOLBAR_ICON_SIZE || y > (TOOLBAR_ICON_SIZE + TOOLBAR_ICON_SPACING) * this.tools.length) {
            return null;
        }
        if (y % (TOOLBAR_ICON_SIZE + TOOLBAR_ICON_SPACING) < TOOLBAR_ICON_SPACING) {
            return null;
        }
        return Math.floor(y / (TOOLBAR_ICON_SIZE + TOOLBAR_ICON_SPACING));
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.tools.forEach((t, i) => {
            let hovered = this.currentMousePosition !== undefined && this.getToolAtPosition(this.currentMousePosition) === i;
            let state: SelectionState;
            if (this.currentToolIndex === i && this.tools[this.currentToolIndex][2]()) {
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
            t[0].draw(
                    ctx,
                    0,
                    TOOLBAR_ICON_SIZE * i + TOOLBAR_ICON_SPACING * (i + 3) + ToolbarInteractionManager.ToolbarOffsetTop,
                    TOOLBAR_ICON_SIZE,
                    TOOLBAR_ICON_SIZE,
                    state);
        });
    }

}
