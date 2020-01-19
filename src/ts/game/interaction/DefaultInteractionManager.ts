import InteractionManager from "./InteractionManager";
import Game from "../Game";
import { AbstractNode } from "../node/AbstractNode";
import DrawingLinkInteractionManager from "./DrawingLinkInteractionManager";

export default class DefaultInteractionManager implements InteractionManager {
    constructor(private game: Game) { }

    handleClick(x: number, y: number): InteractionManager {
        let clickedObjects = this.game.getObjects().filter(object => object.inside(x, y));

        for (let object of clickedObjects) {
            if (object instanceof AbstractNode) {
                return new DrawingLinkInteractionManager(this.game, object);
            }
        }

        return this;
    }
}