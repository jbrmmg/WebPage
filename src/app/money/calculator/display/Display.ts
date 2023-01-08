import {CalculatorService} from "../calculator-service";

export class Display {
    constructor(private _service: CalculatorService) {
        this._service.statusChange.subscribe(() => this.handleChange());
    }

    handleChange() {
    }

    get Text(): string {
        return this._service.getValue.toFixed(2);
    }

    get Class(): string {
        return this._service.isDebitValue ? 'entry-calculator-db' : 'entry-calculator';
    }
}
