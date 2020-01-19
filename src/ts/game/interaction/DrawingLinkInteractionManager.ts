import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import Link from "../link/Link";
import DefaultInteractionManager from "./DefaultInteractionManager";

export default class DrawingLinkInteractionManager implements InteractionManager {
    constructor(private game: Game, private startNode: AbstractNode) { }

    handleClick(x: number, y: number): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(x, y));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode && object !== this.startNode) {
                this.game.registerObject(new Link([this.startNode, object]));
            }
        }

        return new DefaultInteractionManager(this.game);
    }
}