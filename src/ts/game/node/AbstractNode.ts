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

        let routingTable: [Link, AbstractNode][] =
            this.getRoutableLinks().map(x => [x, x.getOtherEnd(this)]);
        
        while(routingTable.length > 0){
            let visited: AbstractNode[] = [];
            visited.push(this);
            
            if(routingTable[0][1] === p.destination){
                return routingTable[0][0].trySendPacket(p, this);
            }

            let n: AbstractNode = routingTable[0][1];
            n.getRoutableLinks().forEach(
                x => visited.includes(x.getOtherEnd(n)) ? 
                    routingTable.push([routingTable[0][0], x.getOtherEnd(n)]) :
                    undefined
            );

            visited.push(n);

            routingTable.shift();
        }
        
        return false;
    }
}