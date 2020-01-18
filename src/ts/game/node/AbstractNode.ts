export abstract class AbstractNode {
    x: number = 0;
    y: number = 0;
    abstract update(dt: number): void;
}