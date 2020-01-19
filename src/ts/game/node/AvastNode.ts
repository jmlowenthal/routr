import { AbstractNode } from './AbstractNode';
import Game from '../Game';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BoundingBox } from '../types';
import { AntiMalwarePacket } from '../packet/AntiMalwarePacket';
import { NODE_PACKET_LAYOUT_HEIGHT, PACKET_WIDTH } from '../MagicNumber';

export class AvastNode extends AbstractNode {
    private img: HTMLImageElement;
    private packetsList: AbstractPacket[] = [];
    private timer: number = 0;

    constructor(x: number, y: number) {
        super(x,y);
        this.img = new Image();
        this.img.src = "/avast-logo.png";
        this.packetsList.push(new AntiMalwarePacket(this, this));
    }
    update(dt: number, game: Game): void {
        this.timer += dt;
        if (this.timer >= 100000 && !this.isQueueFull()) {
            this.timer = 0;
            this.packetsList.push(new AntiMalwarePacket(this, this));
        }
    }
    
    isQueueOverflowed(): boolean {
        return false;
    }

    isQueueFull() {
        return this.packetsList.length === 5;
    }

    isRoutable() {
        return false;
    }

    receivePacket(packet: AbstractPacket): void {
        throw new Error("Method not implemented.");
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x - 25, this.y - 25);
        let maxj = Math.floor((this.packetsList.length - 1) / NODE_PACKET_LAYOUT_HEIGHT);
        this.packetsList.forEach((p, i) => {
            let j = Math.floor(i / NODE_PACKET_LAYOUT_HEIGHT);
            i = i % NODE_PACKET_LAYOUT_HEIGHT;
            let x = this.x - (PACKET_WIDTH / 2) + (PACKET_WIDTH * 1.5) * (j - maxj / 2);
            let y = this.y - 15 - (PACKET_WIDTH * 1.5) * (i + 2);
            p.draw(ctx, x, y);
        });
    }

    getBoundingBox(): BoundingBox {
        return [this.x - this.img.width / 2, this.y - this.img.height / 2,
                this.x + this.img.width / 2, this.y + this.img.height / 2];
    }

    releasePacket(target: AbstractNode): boolean {
        if (this.packetsList.length > 0) {
            let p = this.packetsList[0];
            p.destination = target;
            if (this.route(p)) {
                this.packetsList.shift();
                return true;
            }
        }
        return false;
    }
}