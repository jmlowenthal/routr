import Drupdatable from "./Drupdatable";
import Game from "./Game";
import { BasicNode } from "./node/BasicNode";
import { AbstractNode } from "./node/AbstractNode";
import { INFECTION_TIMESTEP, NODE_CREATION_RATE_PARAM, MIN_DISTANCE_BETWEEN_OBJECTS, NODE_PACKET_LAYOUT_HEIGHT, PACKET_WIDTH, TOOLBAR_ICON_SIZE } from "./MagicNumber";
import { AvastNode } from "./node/AvastNode";

export default class GameMutator extends Drupdatable {

    private nodeNames = "ABCDEFGHIJKLMNOPQRSTUVWZYZ".split("");
    private timeSinceLastNodeCreation = 0;
    private width = 0;
    private height = 0;
    private time = 0;

    constructor(private generateDestination: (_: AbstractNode) => AbstractNode) {
        super();
    }

    update(dt: number, game: Game) {
        this.time += dt;
        this.timeSinceLastNodeCreation += dt;

        if (Math.random() < this.probability() * (dt / 1000) && this.nodeNames.length > 0) {
            this.timeSinceLastNodeCreation = 0;
            this.generateNewNode(game);
        }

        if (Math.floor((this.time - dt) / INFECTION_TIMESTEP) !== Math.floor(this.time / INFECTION_TIMESTEP)) {
            var nodes = game.getObjects().filter(o => o instanceof BasicNode) as BasicNode[];
            // Infect a random node
            nodes[Math.floor(Math.random() * nodes.length)].setHealth(0);
        }
    }

    generateInitialNodes(game: Game) {
        game.registerObject(new AvastNode(this.width/2, this.height/2));
        this.generateNewNode(game);
        this.generateNewNode(game);
        this.generateNewNode(game);
    }

    private generateNewNode(game: Game) {
        let nodeName = this.nodeNames[0];
        this.nodeNames = this.nodeNames.slice(1);
        let newNode: BasicNode;
        
        do {
            let x = Math.floor(Math.random() * (this.width - 60 - TOOLBAR_ICON_SIZE)) + 30 + TOOLBAR_ICON_SIZE;
            let y = Math.floor(Math.random() * (this.height - 60 - (NODE_PACKET_LAYOUT_HEIGHT * PACKET_WIDTH * 1.6))) + 30 + (NODE_PACKET_LAYOUT_HEIGHT * PACKET_WIDTH * 1.6);
            newNode = new BasicNode(this.generateDestination, nodeName, x, y);
        } while (game.getObjects().some(this.newNodeTooClose(newNode)));

        game.registerObject(newNode);
    }


    private probability(): number {
        return Math.exp(this.timeSinceLastNodeCreation - NODE_CREATION_RATE_PARAM);
    }

    private newNodeTooClose = (newNode: BasicNode) => (other: Drupdatable) => {
        let newBoundingBox = newNode.getBoundingBox();
        let otherBoundingBox = other.getBoundingBox();
        return newBoundingBox[0] - otherBoundingBox[2] < MIN_DISTANCE_BETWEEN_OBJECTS &&
                otherBoundingBox[0] - newBoundingBox[2] < MIN_DISTANCE_BETWEEN_OBJECTS && // x
                newBoundingBox[1] - otherBoundingBox[3] < MIN_DISTANCE_BETWEEN_OBJECTS &&
                otherBoundingBox[1] - newBoundingBox[3] < MIN_DISTANCE_BETWEEN_OBJECTS; // y
    }

    setScreenDimensions(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}