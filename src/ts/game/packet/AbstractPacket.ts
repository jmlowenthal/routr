import { AbstractNode } from "../node/AbstractNode";

export abstract class AbstractPacket {

    source: AbstractNode;
    destination: AbstractNode;

    constructor(source: AbstractNode, dest: AbstractNode) {
        this.source = source;
        this.destination = dest;
    }

    abstract draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    abstract priority(): number;
    deliver(node: AbstractNode): void {};

}