import { AbstractPacket } from "../packet/AbstractPacket";
import { BadPacket } from "../packet/BadPacket";
import { AbstractAttachment } from "./AbstractAttachment"

export class Firewall extends AbstractAttachment {

  constructor(private pos: [number, number], private normal: [number, number]) {
    super();
  }
  
  public draw(ctx: CanvasRenderingContext2D){
    let x_dir: number = this.normal[1] - this.pos[1];
    let y_dir: number = this.pos[0] - this.normal[0];
    let len_dir: number = Math.sqrt(x_dir*x_dir + y_dir*y_dir)/10;
    x_dir /= len_dir;
    y_dir /= len_dir;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.pos[0] - x_dir, this.pos[1] - y_dir);
    ctx.lineTo(this.pos[0] + x_dir, this.pos[1] + y_dir);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  public actUpon(p: AbstractPacket): AbstractPacket[]{
      if(p instanceof BadPacket){
        return [];
      } else {
        return [p];
      }
    }
  
  zIndex(){
    return 30;
  }
}
