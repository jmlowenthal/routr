import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";
import { AvastNode } from "./node/AvastNode";
import Link from "./link/Link";


export default class Game {
    private iteration = 0;
    private initialTime?: number;
    private time = 0;
    private gameMutator: GameMutator;

    private objects: Drupdatable[] = [];

    constructor() {
        let generateDestination = () => this.objects
                .filter(o => o instanceof BasicNode)
                .sort((x, y) => 0.5 - Math.random())
                [0] as AbstractNode;
        let A = new BasicNode(generateDestination, "A", 200, 100);
        let B = new BasicNode(generateDestination, "B", 500, 150);
        let C = new BasicNode(generateDestination, "C", 400, 250);
        let D = new BasicNode(generateDestination, "D", 300, 500);
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

        this.gameMutator = new GameMutator(generateDestination);
        // this.registerObject(this.gameMutator);
    }

    update(timestamp: number, ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.iteration++;
        let dt: number;
        if (this.initialTime === undefined) {
            this.initialTime = timestamp;
            dt = 0;
            this.time = 0;
        } else {
            dt = timestamp - this.time;
            this.time = timestamp - this.initialTime;
        }

        this.gameMutator.setScreenDimensions(width, height);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';

        [...this.objects].forEach(object => object.update(dt, this));
        this.objects.forEach(object => object.draw(ctx));
        this.objects = this.objects.sort((x, y) => 0.5 - Math.random());
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
}