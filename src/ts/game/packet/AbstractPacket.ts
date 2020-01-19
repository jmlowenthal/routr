import { AbstractNode } from "../node/AbstractNode";

export abstract class AbstractPacket {

    source: AbstractNode;
    destination: AbstractNode;

    constructor(source: AbstractNode, dest: AbstractNode) {
        this.source = source;
        this.destination = dest;
    }

    abstract isBad(): boolean;
    abstract isAntiMalware(): boolean;

}