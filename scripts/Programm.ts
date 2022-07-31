import { GraphCalculator } from "./GraphCalculator.js";
import { Input, InputData } from "./Input.js";
import { LinearFunction } from "./LinearFunction.js";
import * as Minecraft from "./Minecraft.js";
import { Vector } from "./Vector.js";
import * as InputToggle from "./InputToggle.js";

export function WriteOutput(text: string): void
{
    const outputElement = <HTMLParagraphElement> document.getElementById("output");
    if(outputElement === null) return;
    outputElement.innerText = text;
}

class Programm
{
    graphCalculator = new GraphCalculator();

    constructor()
    {
        this.OnLoad();
    }

    Main(): void
    {
        var answer = this.FindAnswer();
        WriteOutput(answer);
    }

    private OnLoad(): void
    {
        const programmRef = this;
        const button = <HTMLButtonElement> document.getElementById("calculate_Button");
        if(button !== null) button.addEventListener("click", () => { programmRef.Main(); });
        InputToggle.Select("commandInput");
        Input.LoadCookie();
        console.log()
    }

    private FindAnswer(): string
    {
        var answer = "";

        var inputData = Input.ReadInput();
        if(inputData === null) return "invalid input";
        Input.SaveCookie(inputData);

        var endEyeRays = this.GetEndEyeRays(inputData);
        var intersectionPoint = LinearFunction.GetIntersection(endEyeRays[0], endEyeRays[1]);

        // chunk correction [4, ~, 4]
        var strongholdPos = new Vector(intersectionPoint.x - intersectionPoint.x % 16 + 4, -(intersectionPoint.y - intersectionPoint.y % 16) + 4);

        answer += "x: " + strongholdPos.x + " z: " + strongholdPos.y;

        this.graphCalculator.Update(inputData, endEyeRays, new Vector(strongholdPos.x, -strongholdPos.y));

        var ring: number = Minecraft.GetRing(strongholdPos);
        if(ring === -1) answer += "\n intersection is outside of generation rings!!!";
        else answer += "\n ring: " + ring;

        return answer;
    }

    private GetEndEyeRays(inputData: InputData): LinearFunction[]
    {
        // z has to be inverted, because north in minecraft is -z => -y;
        const fisrtPoint = new Vector(inputData.firstPoint.x, -inputData.firstPoint.y);
        const secondPoint = new Vector(inputData.secondPoint.x, -inputData.secondPoint.y);
        
        var rays: LinearFunction[] = [];

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