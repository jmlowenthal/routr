import { Packet } from "../Packet";
import { AbstractNode } from "../node/AbstractNode";

export class Link implements Updatable {

    public static readonly LENGTH_TIME_MAGIC_FACTOR_OF_PING: number = 0.01;

    private nodes: [AbstractNode, AbstractNode]; // [0] <----> [1]
    private bandwidth: number = 1;
    private packets: [Packet, number, boolean][] = []; // true ->, false <-
    private latency: number;

    constructor(nodes: [AbstractNode, AbstractNode]) {
        this.nodes = nodes;
        let dx = nodes[0].x - nodes[1].x;
        let dy = nodes[0].y - nodes[1].y;
        this.latency = Math.sqrt(dx * dx + dy * dy) * Link.LENGTH_TIME_MAGIC_FACTOR_OF_PING;
    }

    public trySendPacket(packet: Packet, from: AbstractNode): boolean {
        if (this.packets.length > this.bandwidth) {
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
        let delta = 0;
        return Math.min(progress + delta, 1)
    }

    public update(dt: number) {
        this.packets = this.packets.map(triplet => [triplet[0], Link.progressPacket(dt, triplet[1]), triplet[2]]);
        this.packets
            .filter(triplet => triplet[1] >= 1)
            .forEach(triplet => {
                let node = triplet[2] ? this.nodes[1] : this.nodes[0];
                node.receivePacket(triplet[0]);
            });
        this.packets = this.packets.filter(triplet => triplet[1] < 1);
    }
}