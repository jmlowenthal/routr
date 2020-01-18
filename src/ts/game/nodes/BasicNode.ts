import { NetworkNode } from './NetworkNode';
import { Packet } from '../Packet';

export class BasicNode extends NetworkNode {
    private timer: number = 0;
    // private listeners: ((_: Packet) => void)[] = [];
    private getDestination: (() => NetworkNode);
    private packetsList: Packet[] = [];
    private edgeList: Link[] = [];

    constructor(getDestination: (() => NetworkNode)) {
        super();
        this.getDestination = getDestination;
    }

    public update(dt: number): void {
        this.timer += dt;
        if (Math.random() > this.probability()) {
            this.timer = 0;
            var dest = this.getDestination();
            var packet = new Packet(this, dest);
            this.packetsList.push(packet);
            // this.listeners.forEach(function(f) { f(packet) })
        }
    }

    // Returns true if it successfully sends a packet onwards,
    // Otherwise is false
    // Does not remove packet from list
    public route(p: Packet): bool {
      if(edgeList.length <= 0){
        return false;
      }

      let toSearchList: [Link, NetworkNode][] = [];
      edgeList.forEach(x => toSearchList.push([x, x.otherEnd(this)]))
      
      while(toSearchList.length >= 0){
        let visited: NetworkNode[] = [];
        visited.push(this);
       
        if(toSearchList[0][1] = p.Destination){
          toSearchList[0][0].addPacket(p);
          break;
        }

        let n: NetworkNode = toSearchList[0][1];

        n.edgeList.forEach(
          x => visited.includes(x.otherEnd(n)) ? 
                toSearchList.push([toSearchList[0][0], x.otherEnd(n)]) :
                undefined
        );

        visited.push(n);

        toSearchList.shift();
      }
      
    }

    // public addListener(listener: (_: Packet) => void) {
    //     this.listeners.push(listener);
    // }

    // public removeListener(listener: (_: Packet) => void) {
    //     this.listeners = this.listeners.filter(l => l !== listener);
    // }

    private probability(): number {
        return 0.5;
    }
}
