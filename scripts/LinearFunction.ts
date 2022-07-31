import { Vector } from "./Vector.js";

export class LinearFunction
{
    slope: number;
    tangent: number;

    constructor(slope: number, tangent: number)
    {
        this.slope = slope;
        this.tangent = tangent;
    }

    static GetIntersection(f1: LinearFunction, f2: LinearFunction)
    {
        const x = (f2.tangent - f1.tangent) / (f1.slope - f2.slope);
        const y = f1.slope * x + f1.tangent;
        return new Vector(x, y);
    }
}