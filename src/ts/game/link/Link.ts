import { AbstractPacket } from "../packet/AbstractPacket";
import { AbstractNode } from "../node/AbstractNode";
import { AbstractAttachment } from "./AbstractAttachment";
import Drupdatable from "../Drupdatable";
import { BasicNode } from "../node/BasicNode";

export default class Link extends Drupdatable {

    public static readonly LENGTH_TIME_MAGIC_FACTOR_OF_PING: number = 0.000001;

    private nodes: [AbstractNode, AbstractNode]; // [0] <----> [1]
    private bandwidth: number = 1;
    private packets: [AbstractPacket, number, boolean][] = []; // true ->, false <-
    private latency: number;
    public attachment?: AbstractAttachment;

    constructor(nodes: [AbstractNode, AbstractNode]) {
        super();
        this.nodes = nodes;
        let dx = nodes[0].x - nodes[1].x;
        let dy = nodes[0].y - nodes[1].y;
        this.latency = Math.sqrt(dx * dx + dy * dy) * Link.LENGTH_TIME_MAGIC_FACTOR_OF_PING;
        nodes[0].attachedLinks.push(this);
        nodes[1].attachedLinks.push(this);
    }

    public trySendPacket(packet: AbstractPacket, from: AbstractNode): boolean {
        if (this.packets.length >= this.bandwidth) {
            return false;
        }
        if (from == this.nodes[0]) {
            this.packets.push([packet, 0, true]);
        }
        else if (from == this.nodes[1]) {
            this.packets.push([packet, 0, false]);
        }
        else {
            throw new Error("Ya boi don't have that node, alright. 💩");
        }
        return true;
    }

    public getNodes(): [AbstractNode, AbstractNode] {
        return this.nodes;
    }

    public getOtherEnd(node: AbstractNode): AbstractNode {
        if (this.nodes[0] == node) {
            return this.nodes[1];
        }
        else if (this.nodes[1] == node) {
            return this.nodes[0];
        }
        else {
            throw new Error("Ya boi don't have that node, alright. 💩");
        }
    }

    public setBandwidth(bandwidth: number) {
        this.bandwidth = Math.max(0, bandwidth);
    }

    private static progressPacket(dt: number, progress: number): number {
        let delta = dt * this.LENGTH_TIME_MAGIC_FACTOR_OF_PING;
        return Math.min(progress + delta, 1)
    }

    public update(dt: number) {
        let _this = this;
        this.packets = this.packets
            .flatMap(function(t): [AbstractPacket, number, boolean][] {
                var oldpos = t[1]
                var pos = Link.progressPacket(dt, oldpos);
                if (_this.attachment && oldpos < 0.5 && pos >= 0.5) {
                    let something = _this.attachment.actUpon(t[0]);
                    return something.map(s => [s, t[1], t[2]]);
                }
                return [[t[0], pos, t[2]]];
            });
        this.packets
            .filter(triplet => triplet[1] >= 1)
            .forEach(triplet => {
                let node = triplet[2] ? this.nodes[1] : this.nodes[0];
                node.receivePacket(triplet[0]);
            });
        this.packets = this.packets.filter(triplet => triplet[1] < 1);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        let x0 = this.nodes[0].x, y0 = this.nodes[0].y;
        let x1 = this.nodes[1].x, y1 = this.nodes[1].y;
        let dx = x0 - x1, dy = y0 - y1;
        let len = Math.sqrt(dx * dx + dy * dy);
        dx = dx / len * BasicNode.RADIUS;
        dy = dy / len * BasicNode.RADIUS;
        x0 -= dx; y0 -= dy;
        x1 += dx; y1 += dy;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        
        this.packets.forEach(p => {
            let x = x0 * p[1] + x1 * (1 - p[1]);
            let y = y0 * p[1] + y1 * (1 - p[1]);
            ctx.fillRect(x, y, AbstractPacket.WIDTH, AbstractPacket.WIDTH);
        });
    }
}