import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import { AvastNode } from "../node/AvastNode";

export class AvastInteractionManager extends InteractionManager {
    constructor(private game: Game) {
        super();
    }

    handleClick(x: number, y: number): InteractionManager {
        let targets = this.game.getObjects()
            .filter(object => object.inside(x, y))
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

    handleMouseMove(x: number, y: number) {
        return this;
    }

    handleMouseOut() {
        return this;
    }
}