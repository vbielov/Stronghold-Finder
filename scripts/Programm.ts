import { Vector } from "./Vector.js";
import { Input } from "./Input.js";
import { GraphCalculator } from "./GraphCalculator.js";
import { EnchantedBackground } from "./EnchantedBackground.js";
import * as InputToggle from "./InputToggle.js";
import * as StrongholdFinder from "./StrongholdFinder.js"

function WriteOutput(text: string): void {
    const outputElement = <HTMLParagraphElement>document.getElementById("output");
    if (outputElement === null) return;
    outputElement.innerText = text;
}

class Programm {
    graphCalculator = new GraphCalculator();

    constructor() {
        this.OnLoad();
    }

    Main(): void {
        var answer = this.FindAnswer();
        WriteOutput(answer);
    }

    private OnLoad(): void {
        Input.LoadCookie();
        InputToggle.Update();

        const programmRef = this;

        const button = <HTMLButtonElement>document.getElementById("calculate_Button");
        if (button !== null) button.addEventListener("click", () => { programmRef.Main(); });

        // copy to clipboard
        const output = <HTMLParagraphElement>document.getElementById("output");
        if (output !== null) output.addEventListener(("click"), () => {
            navigator.clipboard.writeText(output.innerHTML.split("<br>").shift());
        });
    }

    private FindAnswer(): string {
        var answer = "";

        var inputData = Input.ReadInput();
        if (inputData === null) return "invalid input";
        Input.SaveCookie(inputData);

        if (StrongholdFinder.Test() === false) return "StrongholdFinder did not pass the test";

        var solution = StrongholdFinder.FindAll(inputData);
        var strongholdPos = solution.strongholdsPos[0];
        console.log(solution.strongholdsPos);

        answer += "x: " + strongholdPos.x + " z: " + strongholdPos.y;

        if (this.graphCalculator.calculator !== null) {
            this.graphCalculator.Update(
                inputData, solution.endEyeRays,
                solution.strongholdsPos
            );
        }

        var ring: number = StrongholdFinder.GetRing(strongholdPos);
        if (ring === -1) answer += "\n ⚠ intersection is outside of generation rings";
        else answer += "\n ring: " + (ring + 1);

        return answer;
    }
}

var background: EnchantedBackground = new EnchantedBackground();
var programm = new Programm();
programm.Main();