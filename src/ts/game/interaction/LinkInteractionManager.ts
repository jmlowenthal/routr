import InteractionManager from "./InteractionManager";
import Game from "../Game";
import Link from "../link/Link";
import { Position } from "../types";

export default class LinkInteractionManager extends InteractionManager {
  private static readonly distance: number = 10;
  
  constructor(private game: Game, private behaviour: (_: Link) => void) {
    super();
  }
  
  handleClick(pos: Position): InteractionManager{
    let links: Link[] = this.game.getObjects().filter(object => object instanceof Link) as Link[];
    let linkCandidates: Link[] = links.filter(link => 
        Math.sqrt((pos.x - link.midpoint()[0])*(pos.x - link.midpoint()[0]) + (pos.y - link.midpoint()[1])*(pos.y - link.midpoint()[1])) < LinkInteractionManager.distance);
    if(linkCandidates.length === 0){
      return this;
    }
    else {
      this.behaviour(linkCandidates[0]);
    }
    return this;
  }
}
