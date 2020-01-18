import Drupdatable from "./Drupdatable";
import Game from "./Game";
import { BasicNode } from "./node/BasicNode";
import { AbstractNode } from "./node/AbstractNode";

export default class GameMutator extends Drupdatable {
    private static readonly NODE_CREATION_RATE_PARAM = 1000000;
    private static readonly MIN_DISTANCE_BETWEEN_OBJECTS = 30;

    private nodeNames = "DEFGHIJKLMNOPQRSTUVWZYZ".split("");
    private timeSinceLastNodeCreation = 0;
    private width = 0;
    private height = 0;

    constructor(private generateDestination: () => AbstractNode) {
        super();
    }

    update(dt: number, game: Game) {
        this.timeSinceLastNodeCreation += dt;

        if (Math.random() < this.probability() * (dt / 1000) && this.nodeNames.length > 0) {
            this.timeSinceLastNodeCreation = 0;
            let nodeName = this.nodeNames[0];
            this.nodeNames = this.nodeNames.slice(1);
            let newNode: BasicNode;
            
            do {
                let x = Math.floor(Math.random() * (this.width - 60)) + 30;
                let y = Math.floor(Math.random() * (this.height - 60)) + 30;
                newNode = new BasicNode(this.generateDestination, nodeName, x, y);
            } while (game.getObjects().some(this.newNodeTooClose(newNode)));

            game.registerObject(newNode);
        }
    }

    private probability(): number {
        return Math.exp(this.timeSinceLastNodeCreation - GameMutator.NODE_CREATION_RATE_PARAM);
    }

    private newNodeTooClose = (newNode: BasicNode) => (other: Drupdatable) => {
        let newBoundingBox = newNode.getBoundingBox();
        let otherBoundingBox = other.getBoundingBox();
        return newBoundingBox[0] - otherBoundingBox[2] < GameMutator.MIN_DISTANCE_BETWEEN_OBJECTS &&
                otherBoundingBox[0] - newBoundingBox[2] < GameMutator.MIN_DISTANCE_BETWEEN_OBJECTS && // x
                newBoundingBox[1] - otherBoundingBox[3] < GameMutator.MIN_DISTANCE_BETWEEN_OBJECTS &&
                otherBoundingBox[1] - newBoundingBox[3] < GameMutator.MIN_DISTANCE_BETWEEN_OBJECTS; // y
    }

    setScreenDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}