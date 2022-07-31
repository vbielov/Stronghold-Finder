import { GraphCalculator } from "./GraphCalculator.js";
import { Input } from "./Input.js";
import { LinearFunction } from "./LinearFunction.js";
import * as Minecraft from "./Minecraft.js";
import { Vector } from "./Vector.js";
import * as InputToggle from "./InputToggle.js";
export function WriteOutput(text) {
    const outputElement = document.getElementById("output");
    if (outputElement === null)
        return;
    outputElement.innerText = text;
}
class Programm {
    constructor() {
        this.graphCalculator = new GraphCalculator();
        this.OnLoad();
    }
    Main() {
        var answer = this.FindAnswer();
        WriteOutput(answer);
    }
    OnLoad() {
        const programmRef = this;
        const button = document.getElementById("calculate_Button");
        if (button !== null)
            button.addEventListener("click", () => { programmRef.Main(); });
        InputToggle.Select("commandInput");
        Input.LoadCookie();
        console.log();
    }
    FindAnswer() {
        var answer = "";
        var inputData = Input.ReadInput();
        if (inputData === null)
            return "invalid input";
        Input.SaveCookie(inputData);
        var endEyeRays = this.GetEndEyeRays(inputData);
        var intersectionPoint = LinearFunction.GetIntersection(endEyeRays[0], endEyeRays[1]);
        // chunk correction [4, ~, 4]
        var strongholdPos = new Vector(intersectionPoint.x - intersectionPoint.x % 16 + 4, -(intersectionPoint.y - intersectionPoint.y % 16) + 4);
        answer += "x: " + strongholdPos.x + " z: " + strongholdPos.y;
        this.graphCalculator.Update(inputData, endEyeRays, new Vector(strongholdPos.x, -strongholdPos.y));
        var ring = Minecraft.GetRing(strongholdPos);
        if (ring === -1)
            answer += "\n intersection is outside of generation rings!!!";
        else
            answer += "\n ring: " + ring;
        return answer;
    }
    GetEndEyeRays(inputData) {
        // z has to be inverted, because north in minecraft is -z => -y;
        const fisrtPoint = new Vector(inputData.firstPoint.x, -inputData.firstPoint.y);
        const secondPoint = new Vector(inputData.secondPoint.x, -inputData.secondPoint.y);
        var rays = [];
        const slope1 = Math.tan(Minecraft.FixDegree(inputData.firstDegree) * Math.PI / 180);
        const tangent1 = -slope1 * fisrtPoint.x + fisrtPoint.y;
        rays.push(new LinearFunction(slope1, tangent1));
        const slope2 = Math.tan(Minecraft.FixDegree(inputData.secondDegree) * Math.PI / 180);
        const tangent2 = -slope2 * secondPoint.x + secondPoint.y;
        rays.push(new LinearFunction(slope2, tangent2));
        return rays;
    }
}
var programm = new Programm();
programm.Main();
