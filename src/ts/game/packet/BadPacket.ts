import { AbstractPacket } from "./AbstractPacket";
import { PACKET_WIDTH } from "../MagicNumber";
import { AbstractNode } from "../node/AbstractNode";
import { BasicNode } from "../node/BasicNode";

export class BadPacket extends AbstractPacket {
    priority(): number {
        return 2;
    }
    deliver(node: AbstractNode): void {
        if (node instanceof BasicNode) {
            node.setHealth(node.getHealth() - 1);
        }
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, PACKET_WIDTH, PACKET_WIDTH);
    }
}