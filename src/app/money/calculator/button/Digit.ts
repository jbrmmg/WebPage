import {Base} from "./base/Base";
import {CalculatorService} from "../calculator-service";

export class Digit extends Base {
    private readonly value: number;

    constructor(value: number,
                service: CalculatorService) {
        super(service, 'col-3');
        this.text = value.toString();
        this.value = value;
    }

    buttonClicked() {
        this._service.digit(this.value);
    }
}
