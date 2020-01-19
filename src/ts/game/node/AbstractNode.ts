import Drupdatable from "../Drupdatable";
import Link from "../link/Link";
import { AbstractPacket } from "../packet/AbstractPacket";

export abstract class AbstractNode extends Drupdatable {

    public attachedLinks: Link[] = [];
    
    abstract isRoutable(): boolean;
    abstract receivePacket(_: AbstractPacket): void;
    abstract isQueueOverflowed(): boolean;

    constructor(public readonly x: number, public readonly y: number) {
        super();
    }

    public getRoutableLinks(): Link[] {
        return this.attachedLinks.filter(l => l.getOtherEnd(this).isRoutable());
    }

    // Returns true if it successfully sends a packet onwards,
    // Otherwise is false
    // Does not remove packet from list
    protected route(p: AbstractPacket): boolean {
        if(this.attachedLinks.length <= 0){
            return false;
        }

        let queue: [Link, AbstractNode][] = this.attachedLinks.map(l => [l, l.getOtherEnd(this)]);
        let visited: AbstractNode[] = [];

        while (queue.length > 0) {
            let curr = queue.shift();
            if (!curr) break;

            let firstHop = curr[0];
            let getsTo = curr[1];
            if (getsTo === p.destination) {
                return firstHop.trySendPacket(p, this);
            }

            if (getsTo.isRoutable()) {
                getsTo.attachedLinks.forEach(l => {
                    if (!visited.includes(l.getOtherEnd(getsTo))) {
                        queue.push([firstHop, l.getOtherEnd(getsTo)]);
                    }
                });
            }
            visited.push(getsTo);
        }        
        
        return false;
    }

    zIndex() {
        return 50;
    }
}