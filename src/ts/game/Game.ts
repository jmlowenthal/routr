import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import InteractionManager from "./interaction/InteractionManager";
import CreateLinkInteractionManager from "./interaction/CreateLinkInteractionManager";
import { ToolbarInteractionManager } from "./interaction/ToolbarInteractionManager";
import { CreateLinkIcon } from "./interaction/CreateLinkIcon";
import { AvastInteractionManager } from "./interaction/AvastInteractionManager";


export default class Game {
    private prevTime?: number = 0;
    private gameMutator: GameMutator;
    private interactionManager: InteractionManager = new ToolbarInteractionManager([
        [new CreateLinkIcon(), new CreateLinkInteractionManager(this)],
        [new CreateLinkIcon(), new AvastInteractionManager(this)]
    ]);
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
            this.gameMutator.generateInitialNodes(this);
            this.firstUpdate = false;
        }

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