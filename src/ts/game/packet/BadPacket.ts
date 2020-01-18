import { AbstractPacket } from "./AbstractPacket";

export class BadPacket extends AbstractPacket {
    
    isBad(): boolean {
        return true;
    }
    
    isAntiMalware(): boolean {
        return false;
    }

}