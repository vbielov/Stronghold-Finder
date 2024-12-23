import { Vector } from "./Vector.js";

export class InputData {
    firstPoint: Vector;
    firstDegree: number;
    secondPoint: Vector;
    secondDegree: number;
}

export class LinearFunction {
    slope: number;
    tangent: number;

    constructor(slope: number, tangent: number) {
        this.slope = slope;
        this.tangent = tangent;
    }

    static GetIntersection(f1: LinearFunction, f2: LinearFunction) {
        const x = (f2.tangent - f1.tangent) / (f1.slope - f2.slope);
        const y = f1.slope * x + f1.tangent;
        return new Vector(x, y);
    }
}

function GetSlope(minecraftDegree: number): number {
    // minecraftDegree are from -180 to 180, so add 180 to make it 0 to 360

    // after adding 180 to minecraftDegree. 0° is north direction (positiv Y-axis)
    // and needs to be east (positiv X-axis), therefore add 90
    const rad = (minecraftDegree + 180 + 90) * Math.PI / 180;

    // convert angle in direction
    // NOTE: idk why minus before sin is needed, but it works...
    var direction = new Vector(Math.cos(rad), -Math.sin(rad));

    // return slope
    return direction.y / direction.x;
}

function GetEndEyeRays(inputData: InputData): LinearFunction[] {
    // z has to be inverted, because north in minecraft is -z => +y;
    const fisrtPoint = new Vector(inputData.firstPoint.x, -inputData.firstPoint.y);
    const secondPoint = new Vector(inputData.secondPoint.x, -inputData.secondPoint.y);

    var rays: LinearFunction[] = [];

    const slope1 = GetSlope(inputData.firstDegree);
    const tangent1 = -slope1 * fisrtPoint.x + fisrtPoint.y;
    rays.push(new LinearFunction(slope1, tangent1));

    const slope2 = GetSlope(inputData.secondDegree);
    const tangent2 = -slope2 * secondPoint.x + secondPoint.y;
    rays.push(new LinearFunction(slope2, tangent2));

    return rays;
}

export function Find(inputData: InputData): { strongholdPos: Vector, endEyeRays: LinearFunction[] } {
    var endEyeRays = GetEndEyeRays(inputData);
    var intersectionPoint = LinearFunction.GetIntersection(endEyeRays[0], endEyeRays[1]);

    // chunk correction [4, ~, 4]
    // var strongholdPos = new Vector(
    //     intersectionPoint.x - intersectionPoint.x % 16 + 4,
    //     -(intersectionPoint.y - intersectionPoint.y % 16) + 4
    // );
    var strongholdPos = new Vector(
        intersectionPoint.x,
        -intersectionPoint.y
    );

    return { strongholdPos: strongholdPos, endEyeRays: endEyeRays };
}

export function Test(): boolean {
    const input: InputData = {
        firstPoint: new Vector(-38, 2815),
        firstDegree: -163.5,
        secondPoint: new Vector(377, 2815),
        secondDegree: 166.9
    }
    const rightSolution: Vector = new Vector(192, 2032);
    var testedSolution: Vector = Find(input).strongholdPos;

    if (Vector.Distance(rightSolution, testedSolution) < 100) return true;
    console.error("StrongholdFinder did not pass the test");
    return false;
}

// https://minecraft.fandom.com/wiki/Stronghold?file=Strongholds_1.9.png
export const rings: number[][] = [
    // [from, to, amount]
    [1280, 2816, 3], // 1 ring
    [4352, 5888, 6], // 2 ring
    [7424, 8960, 10], // 3 ring
    [10496, 12032, 15], // 4 ring
    [13568, 15104, 21], // 5 ring
    [16640, 18176, 28], // 6 ring
    [19712, 21248, 36], // 7 ring
    [22784, 24320, 9], // 8 ring
]

export function GetRing(position: Vector): number {
    var posDst = Vector.Distance(new Vector(0, 0), position);
    for (var i = 0; i < rings.length; i++) {
        if (posDst > rings[i][0] && posDst < rings[i][1]) return i;
    }
    return -1;
}

export function FindAll(inputData: InputData): { strongholdsPos: Vector[], endEyeRays: LinearFunction[] } {
    var strongholds: Vector[] = [];
    var intersection = Find(inputData);
    strongholds.push(intersection.strongholdPos);

    var direction = Vector.Normilized(intersection.strongholdPos);
    var ring = GetRing(intersection.strongholdPos);
    if (ring === -1) return { strongholdsPos: strongholds, endEyeRays: intersection.endEyeRays };
    var strongholdsAmount = rings[ring][2];
    var degreeSpace = 360 / strongholdsAmount;

    for (var i = degreeSpace; i < 360; i += degreeSpace) {
        var newDirection = Vector.Rotate(direction, new Vector(0, 0), i);
        var newPosition = Vector.Multiply(newDirection, (rings[ring][1] + rings[ring][0]) / 2);
        strongholds.push(newPosition);
    }

    return { strongholdsPos: strongholds, endEyeRays: intersection.endEyeRays };
}