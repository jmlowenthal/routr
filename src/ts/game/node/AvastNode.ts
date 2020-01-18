import { AbstractNode } from './AbstractNode';
import Game from '../Game';
import { AbstractPacket } from '../packet/AbstractPacket';

export class AvastNode extends AbstractNode {
    update(dt: number, game: Game): void {
        throw new Error("Method not implemented.");
    }

    isQueueOverflowed() {
        return false;
    }

    isRoutable() {
        return false;
    }

    receivePacket(packet: AbstractPacket): void {
        throw new Error("Method not implemented.");
    }
}