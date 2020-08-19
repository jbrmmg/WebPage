import {Component, EventEmitter, OnChanges, Output} from '@angular/core';
import {MoneyCalcBtnRow} from './money-calc-btn-row';
import {
    CalculatorButtonType,
    CalculatorOperator,
    IMoneyCalcButton,
    MoneyCalcButtonClear,
    MoneyCalcButtonDebit,
    MoneyCalcButtonDecimal,
    MoneyCalcButtonDelete,
    MoneyCalcButtonEquals,
    MoneyCalcButtonNumber,
    MoneyCalcButtonOperator,
    MoneyCalcButtonStatus
} from "./money-calc-btn";

@Component({
    selector: 'money-add-calc',
    templateUrl: './money-add-calc.component.html',
    styleUrls: ['./money-add-calc.component.css']
})
export class MoneyAddCalcComponent implements OnChanges {
    rows : Array<MoneyCalcBtnRow> = [];
    btnStatus: MoneyCalcButtonStatus = new MoneyCalcButtonStatus();

    get displayStyle() : string {
        return this.btnStatus.debit ? "entry-calculator-db" : "entry-calculator";
    }

    get calcDisplay() : string {
        return this.btnStatus.display;
    }

    constructor() {

        let debitButton = new MoneyCalcButtonDebit(this.btnStatus);
        this.btnStatus.debitButton = debitButton;

        let newRow = new MoneyCalcBtnRow();
        newRow.addColumn(new MoneyCalcButtonNumber(7, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(8, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(9, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonOperator(CalculatorOperator.ADD, this.btnStatus));
        this.rows.push(newRow);

        newRow = new MoneyCalcBtnRow();
        newRow.addColumn(new MoneyCalcButtonNumber(4, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(5, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(6, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonOperator(CalculatorOperator.SUBTRACT, this.btnStatus));
        this.rows.push(newRow);

        newRow = new MoneyCalcBtnRow();
        newRow.addColumn(new MoneyCalcButtonNumber(1, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(2, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonNumber(3, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonOperator(CalculatorOperator.MULTIPLY, this.btnStatus));
        this.rows.push(newRow);

        newRow = new MoneyCalcBtnRow();
        newRow.addColumn(new MoneyCalcButtonNumber(0, this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonDecimal(this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonEquals(this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonOperator(CalculatorOperator.DIVIDE,this.btnStatus));
        this.rows.push(newRow);

        newRow = new MoneyCalcBtnRow();
        newRow.addColumn(debitButton);
        newRow.addColumn(new MoneyCalcButtonDelete(this.btnStatus));
        newRow.addColumn(new MoneyCalcButtonClear(this.btnStatus));
        this.rows.push(newRow);
    }

    ngOnChanges(): void {
    }

    @Output() valueEntered: EventEmitter<number> = new EventEmitter<number>();

    onClick(button: IMoneyCalcButton) {
        button.buttonClicked();

        // Is the equals button clicked?
        if(button.buttonType == CalculatorButtonType.EQUAL ) {
            this.valueEntered.emit(parseFloat(this.btnStatus.display) * (this.btnStatus.debit ? -1.0 : 1.0));
        }
    }
}
