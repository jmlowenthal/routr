import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import { DrawingLinkInteractionManager } from "./DrawingLinkInteractionManager";
import { Position } from "../types";

export default class CreateLinkInteractionManager extends InteractionManager {
    constructor(private game: Game) {
        super();
    }

    handleClick(pos: Position): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(pos));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode) {
                return new DrawingLinkInteractionManager(this.game, object);
            }
        }

        return this;
    }
}