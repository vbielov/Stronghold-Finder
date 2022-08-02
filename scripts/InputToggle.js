// possible inputs: "commandInput", "manualInput"
function IsInputChecked(id) {
    return document.getElementById(id).checked;
}
function HideElement(id, value) {
    document.getElementById(id).style.display = value === true ? "none" : "block";
}
export function Update() {
    HideElement("commandInput", IsInputChecked("radioInputCommand") === false);
    HideElement("manualInput", IsInputChecked("radioInputManual") === false);
}
document.getElementById("radioInputCommand").onclick = () => { Update(); };
document.getElementById("radioInputManual").onclick = () => { Update(); };
