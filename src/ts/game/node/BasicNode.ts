import { AbstractNode } from './AbstractNode';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BasicPacket } from '../packet/BasicPacket';
import { BoundingBox } from '../types';

const radius = 20;

export class BasicNode extends AbstractNode {

    public static readonly MAX_HEALTH: number = 10;
    public static readonly MAX_QUEUE_LENGTH: number = 20;
    public static readonly MAX_PACKET_DELAY: number = 10;

    private timer: number = 0;
    private packetsList: AbstractPacket[] = [];
    private health: number = BasicNode.MAX_HEALTH;

    constructor(
            private generateDestination: (() => AbstractNode),
            private name: string,
            x: number,
            y: number) {
        super(x, y);
    }

    public update(dt: number): void {
        this.timer += dt;
        if (Math.random() < this.probability()) {
            this.timer = 0;
            //var dest = this.generateDestination();
            // var packet = new BasicPacket(this, dest);
            // this.packetsList.push(packet);
            // this.listeners.forEach(function(f) { f(packet) })
        }
    }

    private probability(): number {
        return Math.exp(this.timer - BasicNode.MAX_PACKET_DELAY);
    }

    isRoutable(): boolean {
        return this.health > 0;
    }

    receivePacket(p: AbstractPacket): void {
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.x + radius, this.y);
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '12px';
        ctx.fillText(this.name, this.x, this.y);
    }

    getBoundingBox(): BoundingBox {
        return [this.x - radius, this.y - radius, this.x + radius, this.y + radius];
    }

    getPacketList(): AbstractPacket[] {
        return this.packetsList;
    }

}
