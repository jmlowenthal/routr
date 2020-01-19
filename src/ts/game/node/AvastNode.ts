import { AbstractNode } from './AbstractNode';
import Game from '../Game';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BasicNode } from './BasicNode';

export class AvastNode extends AbstractNode {
    private img: HTMLImageElement;
    constructor(x: number, y: number) {
        super(x,y);
        this.img = new Image();
        this.img.src = "/avast-logo.png";
    }
    update(dt: number, game: Game): void {
        // throw new Error("Method not implemented.");
    }

    isQueueOverflowed() {
        return false;
    }

    isRoutable() {
        return false;
    }

    receivePacket(packet: AbstractPacket): void {
        throw new Error("Method not implemented.");
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x - 25, this.y - 25);
    }
}