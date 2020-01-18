import { AbstractPacket } from "./AbstractPacket";

export class BasicPacket extends AbstractPacket {

    isBad(): boolean {
        return false;
    }

    isAntiMalware(): boolean {
        return false;
    }
    
}