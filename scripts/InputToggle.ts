// possible inputs: "commandInput", "manualInput"

var selectedElement: string = "manualInput"; // will be replaced onload in Programm

(<HTMLInputElement> document.getElementById("radioInputCommand")).onclick = () => { Select("commandInput"); };
(<HTMLInputElement> document.getElementById("radioInputManual")).onclick = () => { Select("manualInput"); };

export function Select(elementID: string)
{
    (<HTMLDivElement> document.getElementById(selectedElement)).style.display = "none";
    (<HTMLDivElement> document.getElementById(elementID)).style.display = "block";
    selectedElement = elementID;
}