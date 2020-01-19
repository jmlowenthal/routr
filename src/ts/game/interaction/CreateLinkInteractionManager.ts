import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import DrawingLinkInteractionManager from "./DrawingLinkInteractionManager";

export default class CreateLinkInteractionManager extends InteractionManager {
    constructor(private game: Game) {
        super();
    }

    handleClick(x: number, y: number): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(x, y));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode) {
                return new DrawingLinkInteractionManager(this.game, object);
            }
        }

        return this;
    }

    handleMouseMove(x: number, y: number) {
        return this;
    }

    handleMouseOut() {
        return this;
    }
}