import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {CalculatorService} from "../calculator-service";


export class Equals extends Base implements IBase {
    constructor(service: CalculatorService) {
        super(service, 'col-3');
        this.text = '=';
    }

    buttonClicked() {
        this._service.calculate();
    }

    isLinkedKeyPress(keyText: string): boolean {
        if(keyText === "Enter") {
            return true;
        }

        return super.isLinkedKeyPress(keyText);
    }

    isExitButton(): boolean {
        return true;
    }
}
