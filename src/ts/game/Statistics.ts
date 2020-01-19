export function Exp(gamma: number, x0: number, x1: number): number {
    return Math.exp(x1 - gamma) - Math.exp(x0 - gamma);
}

export function Uniform(gamma: number, x0: number, x1: number): number {
    return (x1 - x0) * gamma;
}

export function Linear(gamma: number, x0: number, x1: number): number {
    return (x1 * x1 - x0 * x0) * gamma;
}