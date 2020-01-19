import InteractionManager from "./InteractionManager";
import Game from "../Game";
import Link from "../link/Link";

export default class LinkInteractionManager extends InteractionManager {
  private static readonly distance: number = 10;
  
  constructor(private game: Game, private behaviour: (_: Link) => void) {
    super();
  }
  
  handleClick(x: number, y: number): InteractionManager{
    let links: Link[] = this.game.getObjects().filter(object => object instanceof Link) as Link[];
    let linkCandidates: Link[] = links.filter(link => 
        Math.sqrt((x - link.midpoint()[0])*(x - link.midpoint()[0]) + (y - link.midpoint()[1])*(y - link.midpoint()[1])) < LinkInteractionManager.distance);
    if(linkCandidates.length === 0){
      return this;
    }
    else {
      this.behaviour(linkCandidates[0]);
    }
    return this;
  }

  handleMouseMove(x: number, y: number) {
    return this;
  }

  handleMouseOut() {
    return this;
  }
}
