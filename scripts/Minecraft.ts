import { Vector } from "./Vector.js";

// makes -180 to 180 to normal 360 degree
export function FixDegree(minecraftDegree: number): number
{
    const rad = (minecraftDegree + 180) * Math.PI / 180;
    // NOTE: idk why minus before sin is needed, but it works...
    var direction = new Vector(Math.cos(rad), -Math.sin(rad));
    direction = Vector.Rotate(direction, new Vector(0,0), 90.0);
    var degree = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
    while(degree < 0) 
        degree += 360;
    while(degree > 360) 
        degree -= 360;
    return degree;
}

// https://minecraft.fandom.com/wiki/Stronghold?file=Strongholds_1.9.png
const rings: number[][] = [
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

export function GetRing(position: Vector): number
{
    var posDst = Vector.Distance(new Vector(0, 0), position);
    for(var i = 0; i < rings.length; i++)
    {
        if(posDst > rings[i][0] && posDst < rings[i][1]) return i + 1;
    }
    return -1;
}