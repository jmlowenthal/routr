import InteractionManager from "./InteractionManager";
import Game from "../Game";
import Link from "../link/Link";
import { Position } from "../types";
import { LINK_DELETION_RANGE } from "../MagicNumber";
import Drupdatable from "../Drupdatable";

export default class LinkInteractionManager extends InteractionManager {
  private highlight?: LinkHighlight;

  constructor(private game: Game, private behaviour: (_: Link) => void) {
    super();
  }

  private getCandidate(pos: Position): Link | undefined {
    let links: Link[] = this.game.getObjects().filter(object => object instanceof Link) as Link[];
    let linksWithDistance: [Link, number][] = links.map(link => [link, this.distanceFromLink(pos, link)]);
    let linkCandidates: Link[] = linksWithDistance.filter(e => e[1] < LINK_DELETION_RANGE)
        .sort((a, b) => a[1] - b[1])
        .map(e => e[0]);
    if (linkCandidates.length > 0) {
      return linkCandidates[0];
    }
  }
  
  handleClick(pos: Position): InteractionManager{
    let candidate = this.getCandidate(pos);
    if (candidate) {
      this.behaviour(candidate);
    }
    return this;
  }

  handleMouseMove(pos?: Position): InteractionManager {
    if (!this.highlight) {
      this.highlight = new LinkHighlight();
      this.game.registerObject(this.highlight);
    }
    if (pos) {
      let candidate = this.getCandidate(pos);
      this.highlight.link = candidate;
    }
    return this;
  }

  distanceFromLink(pos: Position, link: Link): number {
    let [A, B] = link.getNodes();
    let square = (x: number) => x * x;
    let linkLenSquared = square(B.x - A.x) + square(B.y - A.y);
    let parallelDistSquared = (B.x-A.x)*(pos.x-A.x) + (B.y-A.y)*(pos.y-A.y);
    // If it's beyond either end of the line, it doesn't count
    if (Math.abs(linkLenSquared) < Math.abs(parallelDistSquared)) {
      return Number.POSITIVE_INFINITY;
    }
    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    return Math.abs((B.y-A.y)*pos.x - (B.x-A.x)*pos.y + B.x*A.y - B.y*A.x) /
        Math.sqrt(square(B.y-A.y) + square(B.x-A.x));
  }
}

class LinkHighlight extends Drupdatable {
  link?: Link;
  draw(ctx: CanvasRenderingContext2D) {
    if (this.link) {
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#fff3";
      ctx.beginPath();
      ctx.moveTo(this.link.getNodes()[0].x, this.link.getNodes()[0].y);
      ctx.lineTo(this.link.getNodes()[1].x, this.link.getNodes()[1].y);
      ctx.stroke();
    }
  }
  zIndex() {
    return 45;
  }
}