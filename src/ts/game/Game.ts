import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import InteractionManager from "./interaction/InteractionManager";
import CreateLinkInteractionManager from "./interaction/CreateLinkInteractionManager";
import { AvastNode } from "./node/AvastNode";
import Link from "./link/Link";
import { ToolbarInteractionManager } from "./interaction/ToolbarInteractionManager";
import { CreateLinkIcon } from "./interaction/CreateLinkIcon";


export default class Game {
    private prevTime?: number = 0;
    private gameMutator: GameMutator;
    private interactionManager: InteractionManager = new ToolbarInteractionManager([
        [new CreateLinkIcon(), new CreateLinkInteractionManager(this)]
    ]);

    private objects: Drupdatable[] = [];

    constructor() {
        let generateDestination = () => this.objects
                .filter(o => o instanceof BasicNode)
                .sort((x, y) => 0.5 - Math.random())
                [0] as AbstractNode;
        let A = new BasicNode(generateDestination, "A", 200, 100);
        let B = new BasicNode(generateDestination, "B", 500, 150);
        let C = new BasicNode(generateDestination, "C", 400, 250);
        let D = new BasicNode(generateDestination, "D", 300, 400);
        let E = new BasicNode(generateDestination, "E", 450, 300);
        this.registerObject(A);
        this.registerObject(B);
        this.registerObject(C);
        this.registerObject(D);
        this.registerObject(E);
        this.registerObject(new Link([A, B]));
        this.registerObject(new Link([A, C]));
        this.registerObject(new Link([D, C]));
        this.registerObject(new Link([E, C]));
        this.registerObject(new Link([E, B]));
        let avastNode = new AvastNode(650, 200);
        this.registerObject(avastNode);
        this.registerObject(new Link([avastNode, B]));

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
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        [...this.objects].forEach(object => object.update(dt, this));
        this.objects
                .filter(obj => obj.zIndex() !== undefined)
                .sort((a, b) => a.zIndex()! - b.zIndex()!)
                .forEach(object => object.draw(ctx));
        this.interactionManager.draw(ctx);
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