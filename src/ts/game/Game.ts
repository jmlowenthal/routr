import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import InteractionManager from "./interaction/InteractionManager";
import CreateLinkInteractionManager from "./interaction/CreateLinkInteractionManager";
import { ToolbarInteractionManager } from "./interaction/ToolbarInteractionManager";
import { AvastInteractionManager } from "./interaction/AvastInteractionManager";
import LinkInteractionManager from "./interaction/LinkInteractionManager";
import { Firewall } from "./link/Firewall"
import Score from "./Score";
import { NODES_PER_FIREWALL, LINKS_PER_NODE } from "./MagicNumber";
import { Icon } from "./interaction/Icon";
import Link from "./link/Link";


export default class Game {
    private prevTime?: number;
    private gameMutator: GameMutator;
    private interactionManager: InteractionManager = new ToolbarInteractionManager([
        [new Icon('/addLink.svg', () => this.getRemainingLinks()), new CreateLinkInteractionManager(this), () => this.getRemainingLinks() > 0],
        [new Icon('/removeLink.svg'), new LinkInteractionManager(this, link => link.deleteLink(this)), () => true],
        [new Icon('/avast-logo.png'), new AvastInteractionManager(this), () => true],
        [new Icon('/firewall.svg', () => this.getRemainingFirewalls()), new LinkInteractionManager(this, link => {
                                this.registerObject( link.attachment = 
                                  new Firewall(link.midpoint(), [link.getNodes()[0].x, link.getNodes()[0].y]) );
                                this.firewallCount++;
                              }), 
                              () => this.getRemainingFirewalls() > 0],
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

    private getRemainingFirewalls() {
        return Math.ceil((this.nodeCount)/NODES_PER_FIREWALL) - this.firewallCount;
    }

    private getRemainingLinks() {
        return Math.ceil((this.nodeCount) * LINKS_PER_NODE) -
                this.objects.reduce((acc, obj) => obj instanceof Link ? acc + 1 : acc, 0);
    }
}
