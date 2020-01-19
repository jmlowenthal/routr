import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import Link from "../link/Link";
import CreateLinkInteractionManager from "./CreateLinkInteractionManager";
import { Position } from "../types";
import Drupdatable from "../Drupdatable";
import { NODE_RADIUS } from "../MagicNumber";

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
        let clickedObjects = this.game.getObjects().filter(object => object.inside(pos) && object instanceof AbstractNode) as AbstractNode[];
        this.inProgressLink.updateEnd(pos, clickedObjects);
        return this;
    }
}

class InProgressLink extends Drupdatable {
    private end?: Position;
    private nodes: AbstractNode[] = [];

    constructor(private start: Position) {
        super();
    }

    updateEnd(pos: Position, nodes: AbstractNode[]) {
        this.end = pos;
        this.nodes = nodes;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.end) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.fillStyle = "#fff3";
            ctx.arc(this.start.x, this.start.y, NODE_RADIUS + 13, 0, 360);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.stroke();
            this.nodes.forEach(n => {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.fillStyle = "#fff3";
                ctx.arc(n.x, n.y, NODE_RADIUS + 13, 0, 360);
                ctx.fill();
            })
        }
    }

    zIndex() {
        return 45;
    }
}