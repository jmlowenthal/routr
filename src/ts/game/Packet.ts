import { AbstractNode } from "./node/AbstractNode";

export class Packet {
    source: AbstractNode;
    destination: AbstractNode;

    constructor(source: AbstractNode, dest: AbstractNode) {
        this.source = source;
        this.destination = dest;
    }
}