import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import Link from "../link/Link";
import CreateLinkInteractionManager from "./CreateLinkInteractionManager";
import { Position } from "../types";
import Drupdatable from "../Drupdatable";

export class DrawingLinkInteractionManager extends InteractionManager {
    private inProgressLink: InProgressLink;

    constructor(private game: Game, private startNode: AbstractNode) {
        super();
        this.inProgressLink = new InProgressLink({x: startNode.x, y: startNode.y});
        game.registerObject(this.inProgressLink);
    }

    handleClick(pos: Position): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(pos));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode && object !== this.startNode &&
                    !this.isAttached(this.startNode, object)) {
                this.game.registerObject(new Link([this.startNode, object]));
            }
        }

        this.game.unregisterObject(this.inProgressLink);
        return new CreateLinkInteractionManager(this.game);
    }

    private isAttached(a: AbstractNode, b: AbstractNode): boolean {
        return a.attachedLinks.some(link => link.getNodes().indexOf(b) !== -1);
    }

    handleMouseMove(pos: Position) {
        this.inProgressLink.updateEnd(pos);
        return this;
    }
}

class InProgressLink extends Drupdatable {
    private end?: Position;

    constructor(private start: Position) {
        super();
    }

    updateEnd(pos?: Position) {
        this.end = pos;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.end) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.stroke();
        }
    }

    zIndex() {
        return 45;
    }
}