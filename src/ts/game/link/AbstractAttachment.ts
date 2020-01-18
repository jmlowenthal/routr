import { AbstractPacket } from "../packet/AbstractPacket";

export abstract class AbstractAttachment implements Drupdatable {

    abstract actUpon(p: AbstractPacket): AbstractPacket[];

}