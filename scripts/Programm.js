import { Input } from "./Input.js";
import { GraphCalculator } from "./GraphCalculator.js";
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
        this.OnLoad();
    }
    Main() {
        var answer = this.FindAnswer();
        WriteOutput(answer);
    }
    OnLoad() {
        this.graphCalculator = new GraphCalculator();
        let inputDataCookie = Input.LoadCookie();
        if (inputDataCookie !== null)
            this.Main();
        InputToggle.Update();
        const programmRef = this;
        const button = document.getElementById("calculate_Button");
        if (button !== null)
            button.addEventListener("click", () => {
                programmRef.Main();
            });
        // copy to clipboard
        const output = document.getElementById("output");
        if (output !== null)
            output.addEventListener(("click"), () => {
                navigator.clipboard.writeText(output.innerHTML.split("<br>").shift());
                console.log("copied to clipboard");
                const outputElement = document.getElementById("output");
                outputElement.innerText = outputElement.innerText.replace("🗐", "✓");
            });
        document.onkeydown = (event) => {
            if (event.key === 'Enter') {
                this.Main();
            }
        };
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
        answer += "x: " + Math.round(strongholdPos.x * 100) / 100;
        answer += " z: " + Math.round(strongholdPos.y * 100) / 100;
        answer += " 🗐";
        this.graphCalculator.Update(inputData, solution.endEyeRays, solution.strongholdsPos);
        var ring = StrongholdFinder.GetRing(strongholdPos);
        if (ring === -1)
            answer += "\n ⚠ intersection is outside of generation rings";
        else {
            const endPortalFrame = document.getElementById("endPortalFrame");
            const endPortalEye = document.getElementById("filledEndPortalFrame");
            endPortalFrame.hidden = true;
            endPortalEye.hidden = false;
            var audios = [
                new Audio('./resources/eye_place1.mp3'),
                new Audio('./resources/eye_place2.mp3'),
                new Audio('./resources/eye_place3.mp3')
            ];
            audios[Math.floor(Math.random() * audios.length)].play();
            answer += "\n ring: " + (ring + 1);
        }
        return answer;
    }
}
var programm = new Programm();
