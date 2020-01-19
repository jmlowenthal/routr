import { AbstractPacket } from "./AbstractPacket";
import { PACKET_WIDTH } from "../MagicNumber";

export class BasicPacket extends AbstractPacket {
    priority(): number {
        return 999;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, PACKET_WIDTH, PACKET_WIDTH);
    }
}