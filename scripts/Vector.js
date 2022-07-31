export class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    static Add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static Sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static DotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static Length(vector) {
        return Math.sqrt(this.DotProduct(vector, vector));
    }
    static Distance(v1, v2) {
        return this.Length(this.Sub(v1, v2));
    }
    toString() {
        return "x: " + Math.floor(this.x) + " y: " + Math.floor(this.y);
    }
    static Rotate(v, origin, degree) {
        var rad = degree * Math.PI / 180;
        var vec = Vector.Sub(v, origin);
        return new Vector(vec.x * Math.cos(rad) - vec.y * Math.sin(rad) + origin.x, vec.x * Math.sin(rad) + vec.y * Math.cos(rad) + origin.y);
    }
}
