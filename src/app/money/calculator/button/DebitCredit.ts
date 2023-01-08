import {Base} from "./base/Base";
import {IBase} from "./base/IBase";
import {CalculatorService} from "../calculator-service";

export class DebitCredit extends Base implements IBase {
    constructor(service: CalculatorService) {
        super(service, 'col-3');
        this.handleChange()
    }

    buttonClicked() {
        this._service.debitCreditChange();
    }

    handleChange() {
        if(this._service.isDebitValue) {
            this.text = 'DB';
            this.buttonStyle = 'btn btn-primary btn-calculator-db';
        } else {
            this.text = 'CR';
            this.buttonStyle = 'btn btn-primary btn-calculator';
        }
    }

    isLinkedKeyPress(keyText: string): boolean {
        if(this._service.isDebitValue) {
            if(keyText === "c" || keyText === "C") {
                return true;
            }
        } else {
            if(keyText === "d" || keyText === "D") {
                return true;
            }
        }

        return super.isLinkedKeyPress(keyText);
    }
}
