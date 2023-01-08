import {IBase} from "./IBase";
import {CalculatorService} from "../../calculator-service";

export class Base implements IBase {
    className: string;
    buttonStyle: string;
    text: string;

    constructor(protected _service: CalculatorService,
                className: string ) {
        this.className = className;
        this.buttonStyle = 'btn btn-primary btn-calculator';
        this._service.statusChange.subscribe(() => this.handleChange());
    }

    buttonClicked() {
    }

    handleChange() {
    }

    isLinkedKeyPress(keyText: string): boolean {
        return keyText === this.text;
    }

    isExitButton(): boolean {
        return false;
    }
}
