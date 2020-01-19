import Game from "../Game";

export default interface InteractionManager {
    handleClick(x: number, y: number): InteractionManager;
}