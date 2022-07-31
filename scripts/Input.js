import { WriteOutput } from "./Main.js";
import { Vector } from "./Vector.js";
const elementPos1_X = document.getElementById("first_VectorX");
const elementPos1_Z = document.getElementById("first_VectorZ");
const elementAngle1 = document.getElementById("first_VectorAngle");
const elementPos2_X = document.getElementById("second_VectorX");
const elementPos2_Z = document.getElementById("second_VectorZ");
const elementAngle2 = document.getElementById("second_VectorAngle");
const elementCommand1 = document.getElementById("command_throw1");
const elementCommand2 = document.getElementById("command_throw2");
export class InputData {
}
export class Input {
    // Public function
    static ReadInput() {
        // try command
        var commandInput = Input.ReadCommandCoordsArr();
        if (commandInput !== null) {
            Input.WriteManualData(commandInput);
            return commandInput;
        }
        // try manual
        var manualInput = Input.ReadManualPoints();
        if (manualInput !== null)
            return manualInput;
        // give up.
        WriteOutput("Incorrect input.");
        return null;
    }
    static LoadCookie() {
        if (document.cookie.indexOf('firstPoint') === -1)
            return null;
        var input = JSON.parse(document.cookie);
        Input.WriteManualData(input);
        return input;
    }
    static SaveCookie(inputData) {
        document.cookie = JSON.stringify(inputData);
    }
    static ReadManualPoints() {
        // Check if numbers are valid
        var inputNumbers = [
            elementPos1_X, elementPos1_Z, elementAngle1, elementPos2_X, elementPos2_Z, elementAngle2
        ].map((inputElement) => {
            if (inputElement === null)
                return null;
            return parseFloat(inputElement.value);
        });
        for (var i = 0; i < inputNumbers.length; i++) {
            if (Number.isNaN(inputNumbers[i]) === true)
                return null;
        }
        // assign data
        var input = new InputData();
        input.firstPoint = new Vector(inputNumbers[0], inputNumbers[1]);
        input.firstDegree = inputNumbers[2];
        input.secondPoint = new Vector(inputNumbers[3], inputNumbers[4]);
        input.secondDegree = inputNumbers[5];
        return input;
    }
    static ReadCommandCoordsArr() {
        // Check if commands are valid
        if (elementCommand1 === null)
            return null;
        if (elementCommand2 === null)
            return null;
        var coordsArr1 = Input.ConvertCommandInCoordsArr(elementCommand1.value);
        var coordsArr2 = Input.ConvertCommandInCoordsArr(elementCommand2.value);
        if (Input.IsCommandOutputValid(coordsArr1) === false)
            return null;
        if (Input.IsCommandOutputValid(coordsArr2) === false)
            return null;
        // assign data
        var input = new InputData();
        input.firstPoint = new Vector(coordsArr1[0], coordsArr1[2]);
        input.firstDegree = coordsArr1[3];
        input.secondPoint = new Vector(coordsArr2[0], coordsArr2[2]);
        input.secondDegree = coordsArr2[3];
        return input;
    }
    static ConvertCommandInCoordsArr(commandString) {
        // input: "/execute in minecraft:the_end run tp @s 100.54 1.00 339.80 5.43 -23.11"
        // cut command to numbers
        var coordsString = commandString.split('@s ').pop();
        // output: "100.54 1.00 339.80 5.43 -23.11"
        // split numbers & convert strings to numbers
        return coordsString.split(' ').map((coord) => parseFloat(coord));
        // output: (5) [100.54, 1, 339.8, 5.43, -23.11]
    }
    static IsCommandOutputValid(coordsArr) {
        if (coordsArr === null)
            return false;
        if (Array.isArray(coordsArr) === false)
            return false;
        if (coordsArr.length !== 5)
            return false;
        for (var i = 0; i < coordsArr.length; i++) {
            if (Number.isNaN(coordsArr[i]) === true)
                return false;
        }
        return true;
    }
    static AssignValueToInput(element, string) {
        if (element !== null)
            element.value = string;
    }
    static WriteManualData(inputData) {
        Input.AssignValueToInput(elementPos1_X, inputData.firstPoint.x.toString());
        Input.AssignValueToInput(elementPos1_Z, inputData.firstPoint.y.toString());
        Input.AssignValueToInput(elementAngle1, inputData.firstDegree.toString());
        Input.AssignValueToInput(elementPos2_X, inputData.secondPoint.x.toString());
        Input.AssignValueToInput(elementPos2_Z, inputData.secondPoint.y.toString());
        Input.AssignValueToInput(elementAngle2, inputData.secondDegree.toString());
    }
}
