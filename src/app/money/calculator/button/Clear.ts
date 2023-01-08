import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {CalculatorService} from "../calculator-service";


export class Clear extends Base implements IBase {
    constructor(service: CalculatorService) {
        super(service, 'col-6');
        this.text = 'CLR';
        this.buttonStyle = 'btn btn-primary btn-calculator-clear';
    }

    buttonClicked() {
        this._service.clear();
    }

    isLinkedKeyPress(keyText: string): boolean {
        if(keyText === "#") {
            return true;
        }

        return super.isLinkedKeyPress(keyText);
    }
}
