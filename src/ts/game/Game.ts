import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import InteractionManager from "./interaction/InteractionManager";
import DefaultInteractionManager from "./interaction/DefaultInteractionManager";
import { AvastNode } from "./node/AvastNode";
import Link from "./link/Link";


export default class Game {
    private prevTime?: number = 0;
    private gameMutator: GameMutator;
    private interactionManager: InteractionManager = new DefaultInteractionManager(this);
    private firstUpdate = true;

    private objects: Drupdatable[] = [];

    constructor() {
        let generateDestination = () => this.objects
                .filter(o => o instanceof BasicNode)
                .sort((x, y) => 0.5 - Math.random())
                [0] as AbstractNode;
        this.gameMutator = new GameMutator(generateDestination);
        this.registerObject(this.gameMutator);
    }

    update(timestamp: number, ctx: CanvasRenderingContext2D, width: number, height: number) {
        let dt: number;
        if (this.prevTime === undefined) {
            dt = 0;
            this.prevTime = timestamp;
        } else {
            dt = timestamp - this.prevTime;
            this.prevTime = timestamp;
        }

        this.gameMutator.setScreenDimensions(width, height);

        if (this.firstUpdate) {
            let avastNode = new AvastNode(width/2, height/2);
            this.registerObject(avastNode);
            this.firstUpdate = false;
            this.gameMutator.generateInitialNodes(this);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        [...this.objects].forEach(object => object.update(dt, this));
        this.objects
                .filter(obj => obj.zIndex() !== undefined)
                .sort((a, b) => a.zIndex()! - b.zIndex()!)
                .forEach(object => object.draw(ctx));
    }

    registerObject(object: Drupdatable) {
        this.objects.push(object);
    }

    unregisterObject(object: Drupdatable) {
        this.objects = this.objects.filter(obj => obj !== object);
    }

    getObjects(): Drupdatable[] {
        return this.objects;
    }

    handleClick(x: number, y: number) {
        this.interactionManager = this.interactionManager.handleClick(x, y);
    }
}