import { AbstractPacket } from "../packet/AbstractPacket";
import { AbstractNode } from "../node/AbstractNode";
import { AbstractAttachment } from "./AbstractAttachment";
import Drupdatable from "../Drupdatable";
import { LINK_SPEED_NUMBER, PACKET_WIDTH } from "../MagicNumber";
import Game from "../Game";

export default class Link extends Drupdatable {

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
        this.latency = LINK_SPEED_NUMBER / Math.sqrt(dx * dx + dy * dy);
        nodes[0].attachedLinks.push(this);
        nodes[1].attachedLinks.push(this);
    }

    public trySendPacket(packet: AbstractPacket, from: AbstractNode): boolean {
        if (this.packets.length >= this.bandwidth) {
            return false;
        }
        if (from === this.nodes[0]) {
            this.packets.push([packet, 0, true]);
        }
        else if (from === this.nodes[1]) {
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
        if (this.nodes[0] === node) {
            return this.nodes[1];
        }
        else if (this.nodes[1] === node) {
            return this.nodes[0];
        }
        else {
            throw new Error("Ya boi don't have that node, alright. 💩");
        }
    }

    public setBandwidth(bandwidth: number) {
        this.bandwidth = Math.max(0, bandwidth);
    }

    private progressPacket(dt: number, progress: number): number {
        let delta = dt * this.latency;
        return Math.min(progress + delta, 1)
    }

    public update(dt: number) {
        let _this = this;
        this.packets = this.packets
            .flatMap(function(t): [AbstractPacket, number, boolean][] {
                var oldpos = t[1]
                var pos = _this.progressPacket(dt, oldpos);
                if (_this.attachment && oldpos < 0.5 && pos >= 0.5) {
                    let something = _this.attachment.actUpon(t[0]);
                    return something.map(s => [s, pos, t[2]]);
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

    public midpoint(): [number, number]{
        let x: number = (this.nodes[0].x + this.nodes[1].x)/2;
        let y: number = (this.nodes[0].y + this.nodes[1].y)/2;
        return [x, y];
    }

    public deleteLink(game: Game){
      this.nodes[0].attachedLinks = this.nodes[0].attachedLinks.filter(l => l !== this);
      this.nodes[1].attachedLinks = this.nodes[1].attachedLinks.filter(l => l !== this);
      if(this.attachment !== undefined){
        game.unregisterObject(this.attachment);
      }
      game.unregisterObject(this);       
    }

    public draw(ctx: CanvasRenderingContext2D) {
        let x0 = this.nodes[0].x, y0 = this.nodes[0].y;
        let x1 = this.nodes[1].x, y1 = this.nodes[1].y;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.setLineDash([]);
        this.packets.forEach(p => {
            let l = p[2] ? p[1] : 1 - p[1];
            let x = x0 * (1 - l) + x1 * l - PACKET_WIDTH / 2;
            let y = y0 * (1 - l) + y1 * l - PACKET_WIDTH / 2;
            p[0].draw(ctx, x, y);
        });

        ctx.fillStyle = "white";
    }

    zIndex() {
        return 20;
    }
}
