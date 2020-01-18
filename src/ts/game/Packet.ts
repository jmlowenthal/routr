import { NetworkNode } from "./nodes/NetworkNode";

export class Packet {
    source: NetworkNode;
    destination: NetworkNode;

    constructor(source: NetworkNode, dest: NetworkNode) {
        this.source = source;
        this.destination = dest;
    }
}