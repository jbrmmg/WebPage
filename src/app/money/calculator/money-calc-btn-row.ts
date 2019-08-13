import {MoneyCalcButton} from "./money-calc-btn";

export class MoneyCalcBtnRow {
    columns: Array<MoneyCalcButton> = [];

    constructor() {
    }

    public addColumn(column: MoneyCalcButton) {
        this.columns.push(column);
    }
}
