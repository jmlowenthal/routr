import { AbstractNode } from './AbstractNode';
import Game from '../Game';
import { AbstractPacket } from '../packet/AbstractPacket';
import { BasicNode } from './BasicNode';

export class AvastNode extends AbstractNode {
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
        let img = new Image(BasicNode.RADIUS * 2, BasicNode.RADIUS * 2);
        img.src = "/avast-logo.png";
        img.width = 10;
        ctx.drawImage(img, 30, 30);
    }
}