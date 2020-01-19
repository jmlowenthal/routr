import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import { AvastNode } from "../node/AvastNode";
import { Position } from "../types";
import Drupdatable from "../Drupdatable";
import { NODE_RADIUS } from "../MagicNumber";

export class AvastInteractionManager extends InteractionManager {
    private target?: Target;
    constructor(private game: Game) {
        super();
    }

    handleClick(pos: Position): InteractionManager {
        let targets = this.game.getObjects()
            .filter(object => object.inside(pos))
            .filter(o => o instanceof AbstractNode)
            .filter(o => !(o instanceof AvastNode)) as AbstractNode[];

        let avastNodes = this.game.getObjects().filter(o => o instanceof AvastNode) as AvastNode[];

        targets.forEach(t => {
            for (var a of avastNodes) {
                if (a.releasePacket(t)) {
                    return;
                }
            }
        });

        return this;
    }
    handleMouseMove(pos?: Position) {
        if (this.target === undefined) {
            this.target = new Target();
            this.game.registerObject(this.target);
        }
        if (pos) {
            let targets = this.game.getObjects()
                .filter(object => object.inside(pos))
                .filter(o => o instanceof AbstractNode)
                .filter(o => !(o instanceof AvastNode)) as AbstractNode[];
            this.target.target = targets.length > 0 ? targets[0] : undefined;
        }
        return this;
    }
}

class Target extends Drupdatable {
    public target?: AbstractNode;
    draw(ctx: CanvasRenderingContext2D) {
        if (this.target) {
            ctx.beginPath();
            ctx.fillStyle = "#ff820033";
            ctx.arc(this.target.x, this.target.y, NODE_RADIUS + 13, 0, 360);
            ctx.fill();
        }
    }
    zIndex() {
        return 45;
    }
}