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
function AssignValueToInput(inputID, value) {
    var inputElement = document.getElementById(inputID);
    if (inputElement === undefined || inputElement === null)
        return;
    inputElement.value = value;
}
function LoadCookie() {
    if (document.cookie.indexOf('firstPoint') === -1)
        return;
    var input = JSON.parse(document.cookie);
    AssignValueToInput("first_VectorX", input.firstPoint.x.toString());
    AssignValueToInput("first_VectorZ", (-input.firstPoint.y).toString());
    AssignValueToInput("first_VectorAngle", input.firstDegree.toString());
    AssignValueToInput("second_VectorX", input.secondPoint.x.toString());
    AssignValueToInput("second_VectorZ", (-input.secondPoint.x).toString());
    AssignValueToInput("second_VectorAngle", input.secondDegree.toString());
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
function GetRing(locatedStronghold) {
    var locatedDst = Vector.Distance(new Vector(0, 0), locatedStronghold);
    for (var i = 0; i < rings.length; i++) {
        if (locatedDst > rings[i][0] && locatedDst < rings[i][1]) {
            return i;
        }
    }
    return -1;
}
function GetGraphBounds(points) {
    var bounds = {
        left: Number.MAX_SAFE_INTEGER,
        right: Number.MIN_SAFE_INTEGER,
        bottom: Number.MAX_SAFE_INTEGER,
        top: Number.MIN_SAFE_INTEGER
    };
    for (var i = 0; i < points.length; i++) {
        bounds.left = Math.min(points[i].x, bounds.left);
        bounds.right = Math.max(points[i].x, bounds.right);
        bounds.bottom = Math.min(points[i].y, bounds.bottom);
        bounds.top = Math.max(points[i].y, bounds.top);
    }
    var scale = 1.5;
    var width = bounds.right - bounds.left;
    var height = bounds.top - bounds.bottom;
    bounds.left -= (width * scale - width) / 2;
    bounds.right += (width * scale - width) / 2;
    bounds.bottom -= (height * scale - height) / 2;
    bounds.top += (height * scale - height) / 2;
    return bounds;
}
// TODO:    Make command reading of F3 + C
//          Design website
//          Write instruction on how to use
var elt = document.getElementById('calculator');
// @ts-ignore
var desmosCalculator = Desmos.GraphingCalculator(elt, { expressions: false });
function UpdateDesmos(input, rays, strongHold) {
    var expressions = desmosCalculator.getExpressions();
    desmosCalculator.removeExpressions(expressions);
    desmosCalculator.setExpression({ id: 'ray1', latex: 'f(x)=(' + rays[0].slope + ')x +' + rays[0].tangent });
    desmosCalculator.setExpression({ id: 'ray2', latex: 'g(x)=(' + rays[1].slope + ')x +' + rays[1].tangent });
    desmosCalculator.setExpression({ id: 'point1', latex: 'A=(' + input.firstPoint.x + ',' + input.firstPoint.y + ')', label: 'First Throw', showLabel: true });
    desmosCalculator.setExpression({ id: 'point2', latex: 'B=(' + input.secondPoint.x + ',' + input.secondPoint.y + ')', label: 'Second Throw', showLabel: true });
    desmosCalculator.setExpression({ id: 'point3', latex: 'C=(' + strongHold.x + ',' + strongHold.y + ')', label: 'Stronghold ' + new Vector(strongHold.x, -strongHold.y), showLabel: true });
    desmosCalculator.setMathBounds(GetGraphBounds([new Vector(0, 0), input.firstPoint, input.secondPoint, strongHold]));
}
function GetStrongholdPosition() {
    var input = GetInput();
    var rays = CalculateRays(input);
    var strongHold = LinearFunction.GetIntersection(rays[0], rays[1]);
    UpdateDesmos(input, rays, strongHold);
}
LoadCookie();
var button = document.getElementById("calculate_Button");
if (button !== undefined && button !== null) {
    button.addEventListener("click", GetStrongholdPosition);
}
