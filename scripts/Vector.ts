export class Vector
{
    x: number;
    y: number;

    constructor(x?: number, y?: number)
    {
        this.x = x || 0;
        this.y = y || 0;
    }

    static Add(v1: Vector, v2: Vector): Vector
    {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static Sub(v1: Vector, v2: Vector): Vector
    {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static DotProduct(v1: Vector, v2: Vector): number
    {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static Length(vector: Vector): number
    {
        return Math.sqrt(this.DotProduct(vector, vector));
    }

    static Distance(v1: Vector, v2: Vector): number
    {
        return this.Length(this.Sub(v1, v2));
    }

    toString(): string
    {
        return "x: " + Math.floor(this.x) + " y: " + Math.floor(this.y);
    }

    static Rotate(v: Vector, origin: Vector, degree: number): Vector
    {
        var rad = degree * Math.PI / 180;
        var vec = Vector.Sub(v, origin);
        return new Vector(
            vec.x * Math.cos(rad) - vec.y * Math.sin(rad) + origin.x,
            vec.x * Math.sin(rad) + vec.y * Math.cos(rad) + origin.y,
        );
    }
}