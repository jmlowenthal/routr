import { AbstractPacket } from "../packet/AbstractPacket";
import Drupdatable from "../Drupdatable";

export abstract class AbstractAttachment extends Drupdatable {

    abstract actUpon(p: AbstractPacket): AbstractPacket[];

}