import {MoneyCalcButton} from './money-calc-btn';

export class MoneyCalcBtnRow {
    columns: Array<MoneyCalcButton> = [];

    public addColumn(column: MoneyCalcButton) {
        this.columns.push(column);
    }
}
