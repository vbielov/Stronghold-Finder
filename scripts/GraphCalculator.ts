import { InputData, LinearFunction } from "./StrongholdFinder.js";
import { Vector } from "./Vector.js";

export class GraphCalculator {
    calculator: any = null;

    constructor() {
        var elt = document.getElementById('calculator');
        var script = document.createElement('script');
        script.setAttribute('src', 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6');
        script.setAttribute('id', "desmos");
        document.body.appendChild(script);
        script.onload = () => {
            // @ts-ignore
            this.calculator = Desmos.GraphingCalculator(elt, { expressions: false });
        };
    }

    private static GetGraphBounds(points: Vector[]): { left: number, right: number, bottom: number, top: number } {
        var bounds = {
            left: Number.MAX_SAFE_INTEGER,
            right: Number.MIN_SAFE_INTEGER,
            bottom: Number.MAX_SAFE_INTEGER,
            top: Number.MIN_SAFE_INTEGER
        };

        for (var i = 0; i < points.length; i++) {
            bounds.left = Math.min(points[i].x, bounds.left);
            bounds.right = Math.max(points[i].x, bounds.right);
            bounds.bottom = Math.min(-points[i].y, bounds.bottom);
            bounds.top = Math.max(-points[i].y, bounds.top);
        }

        // const scale = 1.5;
        // var width = bounds.right - bounds.left;
        // var height = bounds.top - bounds.bottom;

        // bounds.left -= (width * scale - width) / 2;
        // bounds.right += (width * scale - width) / 2;
        // bounds.bottom -= (height * scale - height) / 2;
        // bounds.top += (height * scale - height) / 2;

        return bounds;
    }

    Update(input: InputData, rays: LinearFunction[], strongholdsPos: Vector[]) {
        var expressions = this.calculator.getExpressions();
        this.calculator.removeExpressions(expressions);

        this.calculator.setExpression({ id: 'ray1', latex: 'f(x)=(' + rays[0].slope + ')x +' + rays[0].tangent });
        this.calculator.setExpression({ id: 'ray2', latex: 'g(x)=(' + rays[1].slope + ')x +' + rays[1].tangent });
        this.calculator.setExpression({ id: 'throw1', latex: 'A=(' + input.firstPoint.x + ',' + -input.firstPoint.y + ')', label: 'First Throw', showLabel: true });
        this.calculator.setExpression({ id: 'throw2', latex: 'B=(' + input.secondPoint.x + ',' + -input.secondPoint.y + ')', label: 'Second Throw', showLabel: true });

        for (var i = 0; i < strongholdsPos.length; i++) {
            this.calculator.setExpression(
                {
                    id: 'point' + i,
                    latex: 'P=(' + strongholdsPos[i].x + ',' + -strongholdsPos[i].y + ')',
                    label: 'Stronghold ' + new Vector(strongholdsPos[i].x, strongholdsPos[i].y),
                    showLabel: true
                }
            );
        }

        this.calculator.setMathBounds(GraphCalculator.GetGraphBounds([input.firstPoint, input.secondPoint].concat(strongholdsPos)));
    }
}