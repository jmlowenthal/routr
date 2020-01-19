import { AbstractNode } from './AbstractNode';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BasicPacket } from '../packet/BasicPacket';
import { BoundingBox } from '../types';
import { BadPacket } from '../packet/BadPacket';
import { Exp } from '../Statistics';

export class BasicNode extends AbstractNode {

    public static readonly RADIUS: number = 20;
    public static readonly MAX_HEALTH: number = 10;
    public static readonly MAX_QUEUE_LENGTH: number = 20;
    public static readonly PACKET_DELAY_GAMMA: number = 1500;
    public static readonly MAX_STACK_HEIGHT: number = 5;
    public static readonly BAD_GENERATION_RATIO: number = 0.5;

    private timer: number = 0;
    private packetsList: AbstractPacket[] = [];
    private health: number = BasicNode.MAX_HEALTH;

    constructor(
            private generateDestination: (_: AbstractNode) => AbstractNode | null,
            private name: string,
            x: number,
            y: number) {
        super(x, y);
    }

    public update(dt: number): void {
        //generate packets
        this.timer += dt;
        if (this.health > 0) {
            if (Math.random() < Exp(BasicNode.PACKET_DELAY_GAMMA, this.timer - dt, this.timer)) {
                this.timer = 0;
                var dest = this.generateDestination(this);
                if (dest) {
                    var packet = new BasicPacket(this, dest);
                    this.packetsList.push(packet);
                }
            }
        }
        else {
            if (Math.random() < Exp(BasicNode.PACKET_DELAY_GAMMA, this.timer - dt, this.timer) * BasicNode.BAD_GENERATION_RATIO) {
                this.timer = 0;
                var dest = this.generateDestination(this);
                if (dest) {
                    var packet = new BadPacket(this, dest);
                    this.packetsList.push(packet);
                }
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
        
        this.attachedLinks.sort((x, y) => 0.5 - Math.random());
        this.packetsList.sort((x, y) => x.isBad() ? -1 : (y.isBad() ? 1 : 0));
    }

    isRoutable(): boolean {
        return this.health > 0;
    }

    receivePacket(p: AbstractPacket): void {
        if(p.destination === this){
          if (p.isBad()) {
              this.health = Math.max(this.health - 1, 0);
          }
          else if (p.isAntiMalware()) {
              this.health = Math.min(this.health + 1, BasicNode.MAX_HEALTH);
          }
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
        ctx.lineWidth = 8 * (this.health / BasicNode.MAX_HEALTH) + 2;
        ctx.fillStyle = this.health > 0 ? 'white' : 'red';
        ctx.strokeStyle = this.health > 0 ? 'white' : 'red';
        ctx.beginPath();
        ctx.moveTo(this.x + BasicNode.RADIUS, this.y);
        ctx.arc(this.x, this.y, BasicNode.RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(this.name, this.x, this.y + 2);
        let maxj = Math.floor((this.packetsList.length - 1) / BasicNode.MAX_STACK_HEIGHT);
        this.packetsList.forEach((p, i) => {
            ctx.fillStyle = p.isBad() ? "red" : "white";
            let j = Math.floor(i / BasicNode.MAX_STACK_HEIGHT);
            i = i % BasicNode.MAX_STACK_HEIGHT;
            let x = this.x - (AbstractPacket.WIDTH / 2) + (AbstractPacket.WIDTH * 1.5) * (j - maxj / 2);
            let y = this.y - BasicNode.RADIUS - (AbstractPacket.WIDTH * 1.5) * (i + 2);
            ctx.fillRect(x, y, AbstractPacket.WIDTH, AbstractPacket.WIDTH);
        });
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    }

    getBoundingBox(): BoundingBox {
        return [this.x - BasicNode.RADIUS, this.y - BasicNode.RADIUS, this.x + BasicNode.RADIUS, this.y + BasicNode.RADIUS];
    }

    getPacketList(): AbstractPacket[] {
        return this.packetsList;
    }

}
