// possible inputs: "commandInput", "manualInput"
var selectedElement = "manualInput"; // will be replaced onload in Programm
document.getElementById("radioInputCommand").onclick = () => { Select("commandInput"); };
document.getElementById("radioInputManual").onclick = () => { Select("manualInput"); };
export function Select(elementID) {
    document.getElementById(selectedElement).style.display = "none";
    document.getElementById(elementID).style.display = "block";
    selectedElement = elementID;
}
