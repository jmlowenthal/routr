export abstract class NetworkNode {
    x: number = 0;
    y: number = 0;
    abstract update(dt: number): void;
}