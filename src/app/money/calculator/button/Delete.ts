import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {CalculatorService} from "../calculator-service";

export class Delete extends Base implements IBase {
    constructor(service: CalculatorService) {
        super(service, 'col-3');
        this.text = 'DEL';
    }

    buttonClicked() {
        this._service.delete();
    }

    isLinkedKeyPress(keyText: string): boolean {
        if(keyText === "Delete") {
            return true;
        }

        return super.isLinkedKeyPress(keyText);
    }
}
