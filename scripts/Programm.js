import { Input } from "./Input.js";
import { GraphCalculator } from "./GraphCalculator.js";
import { EnchantedBackground } from "./EnchantedBackground.js";
import * as InputToggle from "./InputToggle.js";
import * as StrongholdFinder from "./StrongholdFinder.js";
function WriteOutput(text) {
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
        Input.LoadCookie();
        InputToggle.Update();
        const programmRef = this;
        const button = document.getElementById("calculate_Button");
        if (button !== null)
            button.addEventListener("click", () => { programmRef.Main(); });
        // copy to clipboard
        const output = document.getElementById("output");
        if (output !== null)
            output.addEventListener(("click"), () => {
                navigator.clipboard.writeText(output.innerHTML.split("<br>").shift());
            });
    }
    FindAnswer() {
        var answer = "";
        var inputData = Input.ReadInput();
        if (inputData === null)
            return "invalid input";
        Input.SaveCookie(inputData);
        if (StrongholdFinder.Test() === false)
            return "StrongholdFinder did not pass the test";
        var solution = StrongholdFinder.FindAll(inputData);
        var strongholdPos = solution.strongholdsPos[0];
        console.log(solution.strongholdsPos);
        answer += "x: " + strongholdPos.x + " z: " + strongholdPos.y;
        if (this.graphCalculator.calculator !== null) {
            this.graphCalculator.Update(inputData, solution.endEyeRays, solution.strongholdsPos);
        }
        var ring = StrongholdFinder.GetRing(strongholdPos);
        if (ring === -1)
            answer += "\n ⚠ intersection is outside of generation rings";
        else
            answer += "\n ring: " + (ring + 1);
        return answer;
    }
}
var background = new EnchantedBackground();
var programm = new Programm();
programm.Main();
