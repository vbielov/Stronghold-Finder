import { GraphCalculator } from "./GraphCalculator.js";
import { Input } from "./Input.js";
import { LinearFunction } from "./LinearFunction.js";
import { FixDegree, GetRing } from "./Minecraft.js";
import { Vector } from "./Vector.js";
function CalculateRays(inputData) {
    var rays = [];
    // z has to be inverted, because north in minecraft is -z => -y;
    var fisrtPoint = new Vector(inputData.firstPoint.x, -inputData.firstPoint.y);
    var secondPoint = new Vector(inputData.secondPoint.x, -inputData.secondPoint.y);
    const slope1 = Math.tan(FixDegree(inputData.firstDegree) * Math.PI / 180);
    const tangent1 = -slope1 * fisrtPoint.x + fisrtPoint.y;
    rays.push(new LinearFunction(slope1, tangent1));
    const slope2 = Math.tan(FixDegree(inputData.secondDegree) * Math.PI / 180);
    const tangent2 = -slope2 * secondPoint.x + secondPoint.y;
    rays.push(new LinearFunction(slope2, tangent2));
    return rays;
}
function GenerateOutputText(strongHoldPos) {
    var answer = new Vector(strongHoldPos.x, -strongHoldPos.y).toString() + '\n';
    var ring = GetRing(strongHoldPos);
    if (ring === -1)
        answer += "Intersection is outside of generation rings, \n this means that you most likely made a mistake \n or the coordinates are not very accurate";
    else
        answer += "Ring: " + ring;
    return answer;
}
export function WriteOutput(text) {
    const outputElement = document.getElementById("output");
    if (outputElement === null)
        return;
    outputElement.innerText = text;
}
var graphCalculator = new GraphCalculator();
function Main() {
    var inputData = Input.ReadInput();
    if (inputData === null)
        return;
    Input.SaveCookie(inputData);
    var rays = CalculateRays(inputData);
    var strongholdPos = LinearFunction.GetIntersection(rays[0], rays[1]);
    graphCalculator.Update(inputData, rays, strongholdPos);
    WriteOutput(GenerateOutputText(strongholdPos));
}
Input.LoadCookie();
Main();
const button = document.getElementById("calculate_Button");
if (button !== null)
    button.addEventListener("click", Main);
