var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector.Add = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.Sub = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    Vector.DotProduct = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    Vector.Length = function (vector) {
        return Math.sqrt(this.DotProduct(vector, vector));
    };
    Vector.Distance = function (v1, v2) {
        return this.Length(this.Sub(v1, v2));
    };
    Vector.prototype.toString = function () {
        return "x: " + Math.floor(this.x) + " y: " + Math.floor(this.y);
    };
    Vector.Rotate = function (v, origin, degree) {
        var rad = degree * Math.PI / 180;
        var vec = Vector.Sub(v, origin);
        return new Vector(vec.x * Math.cos(rad) - vec.y * Math.sin(rad) + origin.x, vec.x * Math.sin(rad) + vec.y * Math.cos(rad) + origin.y);
    };
    return Vector;
}());
var InputData = /** @class */ (function () {
    function InputData() {
        this.firstPoint = new Vector();
        this.firstDegree = 0;
        this.secondPoint = new Vector();
        this.secondDegree = 0;
    }
    return InputData;
}());
function LoadCookie() {
    if (document.cookie.indexOf('firstPoint') === -1)
        return;
    var input = JSON.parse(document.cookie);
    document.getElementById("first_VectorX").value = input.firstPoint.x.toString();
    document.getElementById("first_VectorZ").value = (-input.firstPoint.y).toString();
    document.getElementById("first_VectorAngle").value = input.firstDegree.toString();
    document.getElementById("second_VectorX").value = input.secondPoint.x.toString();
    document.getElementById("second_VectorZ").value = (-input.secondPoint.x).toString();
    document.getElementById("second_VectorAngle").value = input.secondDegree.toString();
    return input;
}
function GetInput() {
    var input = new InputData();
    input.firstPoint = new Vector(parseFloat(document.getElementById("first_VectorX").value), -parseFloat(document.getElementById("first_VectorZ").value));
    input.firstDegree = parseFloat(document.getElementById("first_VectorAngle").value);
    input.secondPoint = new Vector(parseFloat(document.getElementById("second_VectorX").value), -parseFloat(document.getElementById("second_VectorZ").value));
    input.secondDegree = parseFloat(document.getElementById("second_VectorAngle").value);
    document.cookie = JSON.stringify(input);
    return input;
}
function FixDegree(minecraftDegree) {
    var rad = (minecraftDegree + 180) * Math.PI / 180;
    // NOTE: idk why minus before sin is needed, but it works...
    var direction = new Vector(Math.cos(rad), -Math.sin(rad));
    direction = Vector.Rotate(direction, new Vector(0, 0), 90.0);
    var degree = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
    while (degree < 0)
        degree += 360;
    while (degree > 360)
        degree -= 360;
    return degree;
}
var LinearFunction = /** @class */ (function () {
    function LinearFunction(slope, tangent) {
        this.slope = slope;
        this.tangent = tangent;
    }
    LinearFunction.GetIntersection = function (f1, f2) {
        var x = (f2.tangent - f1.tangent) / (f1.slope - f2.slope);
        var y = f1.slope * x + f1.tangent;
        return new Vector(x, y);
    };
    return LinearFunction;
}());
function CalculateRays(inputData) {
    var rays = [];
    var slope1 = Math.tan(FixDegree(inputData.firstDegree) * Math.PI / 180);
    var tangent1 = -slope1 * inputData.firstPoint.x + inputData.firstPoint.y;
    rays.push(new LinearFunction(slope1, tangent1));
    var slope2 = Math.tan(FixDegree(inputData.secondDegree) * Math.PI / 180);
    var tangent2 = -slope2 * inputData.secondPoint.x + inputData.secondPoint.y;
    rays.push(new LinearFunction(slope2, tangent2));
    return rays;
}
// https://minecraft.fandom.com/wiki/Stronghold?file=Strongholds_1.9.png
var rings = [
    [1280, 2816, 3],
    [4352, 5888, 6],
    [7424, 8960, 10],
    [10496, 12032, 15],
    [13568, 15104, 21],
    [16640, 18176, 28],
    [19712, 21248, 36],
    [22784, 24320, 9], // 8 ring
];
function CalculateAllStrongHolds(locatedStronghold) {
    var locatedDst = Vector.Distance(new Vector(0, 0), locatedStronghold);
    for (var i = 0; i < rings.length; i++) {
        var strongHolds = [locatedStronghold];
        if (locatedDst > rings[i][0] && locatedDst < rings[i][1]) {
            var addDegree = 360 / rings[i][2];
            for (var o = 1; o < rings[i][2]; o++) {
                var rotatedVector = Vector.Rotate(locatedStronghold, new Vector(0, 0), addDegree * o);
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
function GetStrongholdPosition() {
    var input = GetInput();
    var rays = CalculateRays(input);
    var strongHolds = CalculateAllStrongHolds(LinearFunction.GetIntersection(rays[0], rays[1]));
    console.log(strongHolds);
    var elt = document.getElementById('calculator');
    // @ts-ignore
    var calculator = Desmos.GraphingCalculator(elt);
    calculator.setExpression({ id: 'graph1', latex: 'f(x)=(' + rays[0].slope + ')x +' + rays[0].tangent });
    calculator.setExpression({ id: 'graph2', latex: 'g(x)=(' + rays[1].slope + ')x +' + rays[1].tangent });
}
LoadCookie();
document.getElementById("calculate_Button").addEventListener("click", GetStrongholdPosition);
