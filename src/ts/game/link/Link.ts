import { Packet } from "../Packet";
import { AbstractNode } from "../node/AbstractNode";

export default abstract class Link {
    private nodes: [AbstractNode, AbstractNode];

    constructor(nodes: [AbstractNode, AbstractNode]) {
        this.nodes = nodes;
    }

    getNodes(): [AbstractNode, AbstractNode] {
        return this.nodes;
    }

    abstract trySendPacket(packet: Packet, node: AbstractNode): boolean;
}