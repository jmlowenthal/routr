import { AbstractNode } from './AbstractNode';
import { Packet } from '../Packet';

export class BasicNode extends AbstractNode {

    public static readonly MAX_HEALTH: number = 10;
    public static readonly MAX_QUEUE_LENGTH: number = 20;
    public static readonly MAX_PACKET_DELAY: number = 10;

    private timer: number = 0;
    private generateDestination: (() => AbstractNode);
    private packetsList: Packet[] = [];
    private health: number = BasicNode.MAX_HEALTH;

    constructor(generateDestination: (() => AbstractNode)) {
        super();
        this.generateDestination = generateDestination;
    }

    public update(dt: number): void {
        this.timer += dt;
        if (Math.random() > this.probability()) {
            this.timer = 0;
            var dest = this.generateDestination();
            var packet = new Packet(this, dest);
            this.packetsList.push(packet);
            // this.listeners.forEach(function(f) { f(packet) })
        }
    }

    private probability(): number {
        return Math.exp(this.timer - BasicNode.MAX_PACKET_DELAY);
    }

    isRoutable(): boolean {
        return this.health > 0;
    }

    receivePacket(p: Packet): void {
        if (p.isBad()) {
            this.health = Math.max(this.health - 1, 0);
        }
        else if (p.isAntiMalware()) {
            this.health = Math.min(this.health + 1, BasicNode.MAX_HEALTH);
        }
        else {
            this.packetsList.push(p);
        }
    }
    
    isQueueOverflowed(): boolean {
        return this.packetsList.length > BasicNode.MAX_QUEUE_LENGTH;
    }

    getHealth(): number {
        return this.health;
    }

    setHealth(health: number): void {
        this.health = Math.max(0, Math.min(health, BasicNode.MAX_HEALTH));
    }

    getPacketList(): Packet[] {
        return this.packetsList;
    }

}
