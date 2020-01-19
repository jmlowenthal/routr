import InteractionManager from "./InteractionManager";
import { Icon } from "./Icon";
import { TOOLBAR_ICON_SIZE } from "../MagicNumber";

export class ToolbarInteractionManager implements InteractionManager {

    private tools: [Icon, InteractionManager][];
    private currentToolIndex: number = -1;

    constructor(tools: [Icon, InteractionManager][]) {
        this.tools = tools;
    }

    handleClick(x: number, y: number): InteractionManager {
        let i = Math.floor(x / TOOLBAR_ICON_SIZE);
        if (y < TOOLBAR_ICON_SIZE && i < this.tools.length) {
            this.currentToolIndex = this.currentToolIndex !== i ? i : -1;
        }
        else if (this.currentToolIndex >= 0) {
            this.tools[this.currentToolIndex][1] = this.tools[this.currentToolIndex][1].handleClick(x, y);
        }
        return this;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.tools.forEach((t, i) => {
            t[0].draw(ctx, TOOLBAR_ICON_SIZE * i, 0, TOOLBAR_ICON_SIZE, TOOLBAR_ICON_SIZE, this.currentToolIndex === i);
        })
    }

}