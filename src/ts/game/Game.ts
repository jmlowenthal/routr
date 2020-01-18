import Drupdatable from "./Drupdatable";
import { BasicNode } from "./node/BasicNode";
import GameMutator from "./GameMutator";
import { AbstractNode } from "./node/AbstractNode";


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
        this.registerObject(new BasicNode(generateDestination, "A", 200, 50));
        this.registerObject(new BasicNode(generateDestination, "B", 600, 50));
        this.registerObject(new BasicNode(generateDestination, "C", 400, 150));

        this.gameMutator = new GameMutator(generateDestination);
        this.registerObject(this.gameMutator);
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

        [...this.objects].forEach(object => object.update(dt, this));
        this.objects.forEach(object => object.draw(ctx));
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