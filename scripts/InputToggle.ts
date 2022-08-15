// possible inputs: "commandInput", "manualInput"

function IsInputChecked(id: string): boolean {
    return (<HTMLInputElement>document.getElementById(id)).checked;
}

function HideElement(id: string, value: boolean): void {
    (<HTMLElement>document.getElementById(id)).style.display = value === true ? "none" : "block";
}

export function Update() {
    HideElement("commandInput", IsInputChecked("radioInputCommand") === false);
    HideElement("manualInput", IsInputChecked("radioInputManual") === false);
}

(<HTMLInputElement>document.getElementById("radioInputCommand")).onclick = () => { Update(); };
(<HTMLInputElement>document.getElementById("radioInputManual")).onclick = () => { Update(); };