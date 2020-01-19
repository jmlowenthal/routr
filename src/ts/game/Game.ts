import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import InteractionManager from "./interaction/InteractionManager";
import CreateLinkInteractionManager from "./interaction/CreateLinkInteractionManager";
import { ToolbarInteractionManager } from "./interaction/ToolbarInteractionManager";
import { CreateLinkIcon } from "./interaction/CreateLinkIcon";
import { AvastInteractionManager } from "./interaction/AvastInteractionManager";
import LinkInteractionManager from "./interaction/LinkInteractionManager";
import { Firewall } from "./link/Firewall"
import Score from "./Score";
import { NODES_PER_FIREWALL } from "./MagicNumber";


export default class Game {
    private prevTime?: number;
    private gameMutator: GameMutator;
    private interactionManager: InteractionManager = new ToolbarInteractionManager([
        [new CreateLinkIcon('/addLink.svg'), new CreateLinkInteractionManager(this), () => true],
        [new CreateLinkIcon('/removeLink.svg'), new LinkInteractionManager(this, link => link.deleteLink(this)), () => true],
        [new CreateLinkIcon('/avast-logo.png'), new AvastInteractionManager(this), () => true],
        [new CreateLinkIcon('/firewall.svg'), new LinkInteractionManager(this, link => {
                                this.registerObject( link.attachment = 
                                  new Firewall(link.midpoint(), [link.getNodes()[0].x, link.getNodes()[0].y]) );
                                this.firewallCount++;
                              }), 
                              () => Math.ceil((this.nodeCount)/NODES_PER_FIREWALL) > this.firewallCount],
    ]);
    private firstUpdate = true;
    private score = 0;
    public nodeCount = 0;
    public firewallCount = 0;
    private objects: Drupdatable[] = [];

    constructor(private gameOverCallback: (score: number) => void) {
        let generateDestination = () => this.objects
                .filter(o => o instanceof BasicNode)
                .sort((x, y) => 0.5 - Math.random())
                [0] as AbstractNode;
        this.gameMutator = new GameMutator(generateDestination);
        this.registerObject(this.gameMutator);
        this.registerObject(new Score(this));
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

        [...this.objects].forEach(object => {
            object.update(dt, this);
            this.score += object.scoreUpdate();
        });
        this.objects
                .filter(obj => obj.zIndex() !== undefined)
                .sort((a, b) => a.zIndex()! - b.zIndex()!)
                .forEach(object => object.draw(ctx));
        this.interactionManager.draw(ctx);

        if (this.objects.some(o => o.gameOver()) || !this.objects.some(o => o instanceof BasicNode && o.getHealth() > 0)) {
            this.gameOverCallback(this.score);
        }

        this.objects.sort((a, b) => 0.5 - Math.random());
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

    withInteractionManager(fn: (im: InteractionManager) => InteractionManager) {
        this.interactionManager = fn(this.interactionManager);
    }

    getScore() {
        return this.score;
    }
}
