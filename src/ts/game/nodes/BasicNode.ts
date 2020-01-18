import { NetworkNode } from './NetworkNode';
import { Packet } from '../Packet';

export class BasicNode extends NetworkNode {
    private timer: number = 0;
    // private listeners: ((_: Packet) => void)[] = [];
    private getDestination: (() => NetworkNode);
    private packetsList: Packet[] = [];

    constructor(getDestination: (() => NetworkNode)) {
        super();
        this.getDestination = getDestination;
    }

    public update(dt: number): void {
        this.timer += dt;
        if (Math.random() > this.probability()) {
            this.timer = 0;
            var dest = this.getDestination();
            var packet = new Packet(this, dest);
            this.packetsList.push(packet);
            // this.listeners.forEach(function(f) { f(packet) })
        }
    }

    // public addListener(listener: (_: Packet) => void) {
    //     this.listeners.push(listener);
    // }

    // public removeListener(listener: (_: Packet) => void) {
    //     this.listeners = this.listeners.filter(l => l !== listener);
    // }

    private probability(): number {
        return 0.5;
    }
}