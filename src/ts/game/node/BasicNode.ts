import { AbstractNode } from './AbstractNode';
import { Packet } from '../Packet';

const radius = 20;

export class BasicNode extends AbstractNode {
    private name = "X";
    /*private timer: number = 0;
    // private listeners: ((_: Packet) => void)[] = [];
    private getDestination: (() => AbstractNode);
    private packetsList: Packet[] = [];
    private edgeList: Link[] = [];

    constructor(getDestination: (() => AbstractNode)) {
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
    public route(p: Packet): boolean {
      if(edgeList.length <= 0){
        return false;
      }

      let toSearchList: [Link, AbstractNode][] = [];
      edgeList.forEach(x => toSearchList.push([x, x.otherEnd(this)]))
      
      while(toSearchList.length >= 0){
        let visited: AbstractNode[] = [];
        visited.push(this);
       
        if(toSearchList[0][1] = p.Destination){
          toSearchList[0][0].addPacket(p);
          break;
        }

        let n: AbstractNode = toSearchList[0][1];

        n.edgeList.forEach(
          x => visited.includes(x.otherEnd(n)) ? 
                toSearchList.push([toSearchList[0][0], x.otherEnd(n)]) :
                undefined
        );

        visited.push(n);

        toSearchList.shift();
      }
      
      return true;
    }

    // public addListener(listener: (_: Packet) => void) {
    //     this.listeners.push(listener);
    // }

    // public removeListener(listener: (_: Packet) => void) {
    //     this.listeners = this.listeners.filter(l => l !== listener);
    // }

    private probability(): number {
        return 0.5;
    }*/

    draw(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.x + radius, this.y);
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '12px';
      ctx.fillText(this.name, this.x, this.y);
    }
}
