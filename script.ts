class Vector
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

class InputData
{
    firstPoint: Vector = new Vector();
    firstDegree: number = 0;
    secondPoint: Vector = new Vector();
    secondDegree: number = 0;
}

function LoadCookie(): InputData
{
    if(document.cookie.indexOf('firstPoint') === -1) 
        return;
    var input = <InputData> JSON.parse(document.cookie);

    (<HTMLInputElement> document.getElementById("first_VectorX")).value = input.firstPoint.x.toString();
    (<HTMLInputElement> document.getElementById("first_VectorZ")).value = (-input.firstPoint.y).toString();
    (<HTMLInputElement> document.getElementById("first_VectorAngle")).value = input.firstDegree.toString();

    (<HTMLInputElement> document.getElementById("second_VectorX")).value = input.secondPoint.x.toString();
    (<HTMLInputElement> document.getElementById("second_VectorZ")).value = (-input.secondPoint.x).toString();
    (<HTMLInputElement> document.getElementById("second_VectorAngle")).value = input.secondDegree.toString();

    return input;
}

function GetInput(): InputData
{
    var input = new InputData();
    input.firstPoint = new Vector(
        parseFloat((<HTMLInputElement> document.getElementById("first_VectorX")).value),
        -parseFloat((<HTMLInputElement> document.getElementById("first_VectorZ")).value),
    );
    input.firstDegree = parseFloat((<HTMLInputElement> document.getElementById("first_VectorAngle")).value);
    
    input.secondPoint = new Vector(
        parseFloat((<HTMLInputElement> document.getElementById("second_VectorX")).value), 
        -parseFloat((<HTMLInputElement> document.getElementById("second_VectorZ")).value),
    );
    input.secondDegree = parseFloat((<HTMLInputElement> document.getElementById("second_VectorAngle")).value);
    document.cookie = JSON.stringify(input);
    return input;
}

function FixDegree(minecraftDegree: number): number
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

class LinearFunction
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

function CalculateRays(inputData: InputData): LinearFunction[]
{
    var rays: LinearFunction[] = [];

    const slope1 = Math.tan(FixDegree(inputData.firstDegree) * Math.PI / 180);
    const tangent1 = -slope1 * inputData.firstPoint.x + inputData.firstPoint.y;
    rays.push(new LinearFunction(slope1, tangent1));

    const slope2 = Math.tan(FixDegree(inputData.secondDegree) * Math.PI / 180);
    const tangent2 = -slope2 * inputData.secondPoint.x + inputData.secondPoint.y;
    rays.push(new LinearFunction(slope2, tangent2));

    return rays;
}

// https://minecraft.fandom.com/wiki/Stronghold?file=Strongholds_1.9.png
const rings: number[][] = [
    [1280, 2816, 3], // 1 ring
    [4352, 5888, 6], // 2 ring
    [7424, 8960, 10], // 3 ring
    [10496, 12032, 15], // 4 ring
    [13568, 15104, 21], // 5 ring
    [16640, 18176, 28], // 6 ring
    [19712, 21248, 36], // 7 ring
    [22784, 24320, 9], // 8 ring
]

function CalculateAllStrongHolds(locatedStronghold: Vector): Vector[]
{
    var locatedDst = Vector.Distance(new Vector(0, 0), locatedStronghold);
    for(var i = 0; i < rings.length; i++)
    {
        var strongHolds: Vector[] = [locatedStronghold];

        if(locatedDst > rings[i][0] && locatedDst < rings[i][1])
        {
            var addDegree = 360 / rings[i][2];
            for(var o = 1; o < rings[i][2]; o++)
            {
                var rotatedVector = Vector.Rotate(locatedStronghold, new Vector(0,0), addDegree * o);
                strongHolds.push(new Vector(rotatedVector.x, -rotatedVector.y));
            }
            return strongHolds;
        }
        console.error("the intersection coordinates are outside the generation ring.");
        return strongHolds;
    }
}

// TODO:    Display other strongholds on graph editor
//          Make command reading of F3 + C
//          Design website
//          Write instruction on how to use

function GetStrongholdPosition(): void
{
    const input = GetInput();
    const rays = CalculateRays(input);
    const strongHolds = CalculateAllStrongHolds(LinearFunction.GetIntersection(rays[0], rays[1]));
    console.log(strongHolds);

    var elt = document.getElementById('calculator');
    // @ts-ignore
    var calculator = Desmos.GraphingCalculator(elt);

    calculator.setExpression({ id: 'graph1', latex: 'f(x)=(' + rays[0].slope + ')x +' + rays[0].tangent});
    calculator.setExpression({ id: 'graph2', latex: 'g(x)=(' + rays[1].slope + ')x +' + rays[1].tangent});
}

LoadCookie();
(<HTMLButtonElement> document.getElementById("calculate_Button")).addEventListener("click", GetStrongholdPosition);