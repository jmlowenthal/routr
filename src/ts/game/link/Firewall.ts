import { AbstractPacket } from "../packet/AbstractPacket";
import Drupdatable from "../Drupdatable";
import { BadPacket } from "../packet/BadPacket";
import { AbstractAttachment } from "./AbstractAttachment"

export class Firewall extends AbstractAttachment {

    public actUpon(p: AbstractPacket): AbstractPacket[]{
      if(p instanceof BadPacket){
        return [];
      } else {
        return [p];
      }
    }
}
