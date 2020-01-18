import Drupdatable from "../Drupdatable";

export abstract class AbstractNode extends Drupdatable {
    constructor(protected x: number, protected y: number) {
        super();
    }
}