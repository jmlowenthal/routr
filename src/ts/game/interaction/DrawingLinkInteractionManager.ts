import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import Link from "../link/Link";
import CreateLinkInteractionManager from "./CreateLinkInteractionManager";

export default class DrawingLinkInteractionManager extends InteractionManager {
    constructor(private game: Game, private startNode: AbstractNode) {
        super();
    }

    handleClick(x: number, y: number): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(x, y));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode && object !== this.startNode &&
                    !this.isAttached(this.startNode, object)) {
                this.game.registerObject(new Link([this.startNode, object]));
            }
        }

        return new CreateLinkInteractionManager(this.game);
    }

    private isAttached(a: AbstractNode, b: AbstractNode): boolean {
        return a.attachedLinks.some(link => link.getNodes().indexOf(b) !== -1);
    }

    handleMouseMove(x: number, y: number) {
        return this;
    }

    handleMouseOut() {
        return this;
    }
}