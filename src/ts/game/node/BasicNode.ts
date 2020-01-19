import { AbstractNode } from './AbstractNode';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BasicPacket } from '../packet/BasicPacket';
import { BoundingBox } from '../types';
import { BadPacket } from '../packet/BadPacket';
import { Exp } from '../Statistics';
import Link from '../link/Link';
import { NODE_MAX_HEALTH, PACKET_SPAWN_GAMMA, INFECTED_SPAWN_PENALTY, MAX_QUEUE_LENGTH, NODE_RADIUS, NODE_PACKET_LAYOUT_HEIGHT, PACKET_WIDTH } from '../MagicNumber';

export class BasicNode extends AbstractNode {

    private timer: number = 0;
    private packetsList: AbstractPacket[] = [];
    private health: number = NODE_MAX_HEALTH;

    constructor(
            private generateDestination: () => AbstractNode,
            private name: string,
            x: number,
            y: number) {
        super(x, y);
    }

    public update(dt: number): void {
        //generate packets
        this.timer += dt;
        if (this.health > 0) {
            if (Math.random() < Exp(PACKET_SPAWN_GAMMA, this.timer - dt, this.timer)) {
                this.timer = 0;
                let dest = this.generateDestination();
                if (dest && dest !== this) {
                    let packet = new BasicPacket(this, dest);
                    this.packetsList.push(packet);
                }
            }
        
            //sending packets
            if (this.packetsList.length > 0) {
                if(this.route(this.packetsList[0])){
                    this.packetsList.shift();
                }
                else {
                    let head = this.packetsList[0];
                    this.packetsList.shift();
                    this.packetsList.push(head);
                }
            }    
        }
        else {
            if (Math.random() < Exp(PACKET_SPAWN_GAMMA, this.timer - dt, this.timer) * INFECTED_SPAWN_PENALTY) {
                this.timer = 0;
                let ls = this.getRoutableLinks();
                if (ls.length > 0) {
                    let link: Link = ls[Math.floor(Math.random() * ls.length)];
                    let packet = new BadPacket(this, link.getOtherEnd(this));
                    link.trySendPacket(packet, this);
                }
            }
        }
        this.attachedLinks.sort(() => 0.5 - Math.random());
        this.packetsList.sort((x, y) => x.priority() - y.priority());
    }

    isRoutable(): boolean {
        return this.health > 0;
    }

    receivePacket(p: AbstractPacket): void {
        if(p.destination === this){
            p.deliver(this);
        }
        else {
            this.packetsList.push(p);
        }
    }
    
    isQueueOverflowed(): boolean {
        return this.packetsList.length > MAX_QUEUE_LENGTH;
    }

    getHealth(): number {
        return this.health;
    }

    setHealth(health: number): void {
        this.health = Math.max(0, Math.min(health, NODE_MAX_HEALTH));
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.health > 0 ? 'white' : 'red';
        ctx.beginPath();
        ctx.moveTo(this.x + NODE_RADIUS, this.y);
        ctx.arc(this.x, this.y, NODE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = '#282C34';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = this.health > 0 ? 'white' : 'red';
        ctx.strokeStyle = this.health > 0 ? 'white' : 'red';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(this.name, this.x, this.y + 2);
        if (this.health < NODE_MAX_HEALTH && this.health > 0) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - NODE_RADIUS);
            ctx.arc(this.x, this.y, NODE_RADIUS, 1.5 * Math.PI, (2 * Math.PI * (1 - (this.health / NODE_MAX_HEALTH)) - (0.5 * Math.PI)));
            ctx.stroke();
        }
        let maxj = Math.floor((this.packetsList.length - 1) / NODE_PACKET_LAYOUT_HEIGHT);
        this.packetsList.forEach((p, i) => {
            let j = Math.floor(i / NODE_PACKET_LAYOUT_HEIGHT);
            i = i % NODE_PACKET_LAYOUT_HEIGHT;
            let x = this.x - (PACKET_WIDTH / 2) + (PACKET_WIDTH * 1.5) * (j - maxj / 2);
            let y = this.y - NODE_RADIUS - (PACKET_WIDTH * 1.5) * (i + 2);
            p.draw(ctx, x, y);
        });
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    }

    getBoundingBox(): BoundingBox {
        return [this.x - NODE_RADIUS, this.y - NODE_RADIUS - (NODE_PACKET_LAYOUT_HEIGHT * PACKET_WIDTH * 1.5), this.x + NODE_RADIUS, this.y + NODE_RADIUS];
    }

    getPacketList(): AbstractPacket[] {
        return this.packetsList;
    }

}
