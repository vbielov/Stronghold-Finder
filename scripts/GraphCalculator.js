import { rings } from "./StrongholdFinder.js";
import { Vector } from "./Vector.js";
export class GraphCalculator {
    constructor() {
        this.calculator = null;
        this.fullscreen = false;
        var elt = document.getElementById('calculator');
        var script = document.createElement('script');
        script.setAttribute('src', 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6');
        script.setAttribute('id', "desmos");
        document.body.appendChild(script);
        script.onload = () => {
            // @ts-ignore
            this.calculator = Desmos.GraphingCalculator(elt, { expressions: false });
            // if input is already set, update the calculator
            if (this.input !== undefined && this.rays !== undefined && this.strongholdsPos !== undefined)
                this.Update(this.input, this.rays, this.strongholdsPos);
        };
        this.fullscreen = false;
        const fullScreenButton = document.getElementById('fullscreen');
        fullScreenButton.onclick = () => {
            this.fullscreen = !this.fullscreen;
            if (this.fullscreen) {
                elt.style.position = 'absolute';
                elt.style.top = '0';
                elt.style.left = '0';
                elt.style.height = '100vh';
                elt.style.width = '100vw';
            }
            else {
                elt.style.position = 'relative';
                elt.style.width = '100%';
                elt.style.height = '560px';
            }
            this.calculator.resize();
        };
        document.onkeydown = (event) => {
            if (event.key === 'Escape') {
                elt.style.position = 'relative';
                elt.style.width = '100%';
                elt.style.height = '560px';
                this.fullscreen = false;
                this.calculator.resize();
            }
        };
    }
    Update(input, rays, strongholdsPos) {
        // if calculator is not loaded yet, 
        // => save the input and wait for the calculator to load
        this.input = input;
        this.rays = rays;
        this.strongholdsPos = strongholdsPos;
        if (this.calculator === null)
            return;
        var expressions = this.calculator.getExpressions();
        this.calculator.removeExpressions(expressions);
        this.calculator.setExpression({ id: 'ray1', latex: 'f(x)=(' + rays[0].slope + ')x +' + rays[0].tangent });
        this.calculator.setExpression({ id: 'ray2', latex: 'g(x)=(' + rays[1].slope + ')x +' + rays[1].tangent });
        this.calculator.setExpression({ id: 'throw1', latex: 'A=(' + input.firstPoint.x + ',' + -input.firstPoint.y + ')', label: 'First Throw', showLabel: true });
        this.calculator.setExpression({ id: 'throw2', latex: 'B=(' + input.secondPoint.x + ',' + -input.secondPoint.y + ')', label: 'Second Throw', showLabel: true });
        for (var i = 0; i < rings.length; i++) {
            let dst = Math.sqrt(Math.pow(strongholdsPos[i].x, 2) + Math.pow(strongholdsPos[i].y, 2));
            if (dst > rings[i][0] && dst < rings[i][1]) {
                this.calculator.setExpression({ id: 'r_0' + i, latex: 'r_{0' + i + '}=' + rings[i][1] });
                this.calculator.setExpression({ id: 'r_1' + i, latex: 'r_{1' + i + '}=' + rings[i][0] });
                this.calculator.setExpression({ id: 'ring0' + i, latex: 'r_{1' + i + '} < y < (\\sqrt{-x^2 + r_{0' + i + '}^2})', color: "#388c46", lines: false });
                this.calculator.setExpression({ id: 'ring1' + i, latex: '-r_{1' + i + '} > y > -(\\sqrt{-x^2 + r_{0' + i + '}^2})', color: "#388c46", lines: false });
                this.calculator.setExpression({ id: 'ring2' + i, latex: '-(\\sqrt{-y^2+r_{0' + i + '}^2}) < x < -(\\sqrt{-y^2+r_{1' + i + '}^2})', color: "#388c46", lines: false });
                this.calculator.setExpression({ id: 'ring3' + i, latex: '(\\sqrt{-y^2+r_{0' + i + '}^2}) > x > (\\sqrt{-y^2 + r_{1' + i + '}^2})', color: "#388c46", lines: false });
                break;
            }
        }
        for (var i = 0; i < strongholdsPos.length; i++) {
            this.calculator.setExpression({
                id: 'point' + i,
                latex: 'P=(' + strongholdsPos[i].x + ',' + -strongholdsPos[i].y + ')',
                label: 'Stronghold ' + new Vector(strongholdsPos[i].x, strongholdsPos[i].y),
                showLabel: true
            });
        }
        // Bounds check
        let graphPoints = [input.firstPoint, input.secondPoint].concat(strongholdsPos);
        let minX, maxX, minY, maxY;
        minX = minY = Number.MAX_SAFE_INTEGER;
        maxX = maxY = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < graphPoints.length; i++) {
            minX = Math.min(minX, graphPoints[i].x);
            maxX = Math.max(maxX, graphPoints[i].x);
            minY = Math.min(minY, -graphPoints[i].y);
            maxY = Math.max(maxY, -graphPoints[i].y);
        }
        let width = maxX - minX;
        let height = maxY - minY;
        var bounds;
        if (width > height) {
            bounds = {
                left: -width,
                right: width,
                bottom: -width / 16 * 9,
                top: width / 16 * 9
            };
        }
        else {
            bounds = {
                left: -height / 9 * 16,
                right: height / 9 * 16,
                bottom: -height,
                top: height
            };
        }
        this.calculator.setMathBounds(bounds);
    }
}
