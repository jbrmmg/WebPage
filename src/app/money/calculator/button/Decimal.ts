import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {CalculatorService} from "../calculator-service";

export class Decimal extends Base implements IBase {
    constructor(service: CalculatorService) {
        super(service, 'col-3');
        this.text = '.';
    }

    buttonClicked() {
        this._service.decimal();
    }
}
