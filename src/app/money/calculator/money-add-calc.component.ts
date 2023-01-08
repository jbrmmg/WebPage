import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {CalculatorService} from "./calculator-service";
import {ButtonRow} from './button/ButtonRow';
import {Display} from './display/Display';
import {IBase} from "./button/base/IBase";
import {DebitCredit} from "./button/DebitCredit";
import {Digit} from "./button/Digit";
import {Operator} from "./button/Operator";
import {OperatorType} from "./enum/OperatorType";
import {Decimal} from "./button/Decimal";
import {Equals} from "./button/Equals";
import {Delete} from "./button/Delete";
import {Clear} from "./button/Clear";

@Component({
    selector: 'jbr-money-add-calc',
    templateUrl: './money-add-calc.component.html',
    styleUrls: ['./money-add-calc.component.css']
})
export class MoneyAddCalcComponent implements OnInit {
    service: CalculatorService = new CalculatorService();
    display: Display;
    rows: Array<ButtonRow> = [];

    @Input()  initialValue: number;

    @Output() valueEntered: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
        this.display = new Display(this.service);

        let newRow = new ButtonRow();
        newRow.addColumn(new Digit(7, this.service));
        newRow.addColumn(new Digit(8, this.service));
        newRow.addColumn(new Digit(9, this.service));
        newRow.addColumn(new Operator(OperatorType.ADD, this.service));
        this.rows.push(newRow);

        newRow = new ButtonRow();
        newRow.addColumn(new Digit(4, this.service));
        newRow.addColumn(new Digit(5, this.service));
        newRow.addColumn(new Digit(6, this.service));
        newRow.addColumn(new Operator(OperatorType.SUBTRACT, this.service));
        this.rows.push(newRow);

        newRow = new ButtonRow();
        newRow.addColumn(new Digit(1, this.service));
        newRow.addColumn(new Digit(2, this.service));
        newRow.addColumn(new Digit(3, this.service));
        newRow.addColumn(new Operator(OperatorType.MULTIPLY, this.service));
        this.rows.push(newRow);

        newRow = new ButtonRow();
        newRow.addColumn(new Digit(0, this.service));
        newRow.addColumn(new Decimal(this.service));
        newRow.addColumn(new Equals(this.service));
        newRow.addColumn(new Operator(OperatorType.DIVIDE, this.service));
        this.rows.push(newRow);

        newRow = new ButtonRow();
        newRow.addColumn(new DebitCredit(this.service));
        newRow.addColumn(new Delete(this.service));
        newRow.addColumn(new Clear(this.service));
        this.rows.push(newRow);
    }

    ngOnInit(): void {
        this.service.initialise(this.initialValue);
    }

    @HostListener('document:keypress',['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        console.info('key:' + event.key);

        // Click the key that is linked to the key press.
        this.rows.forEach((row) => {
            row.columns.forEach((button) => {
                if(button.isLinkedKeyPress(event.key)) {
                    this.onClick(button);
                }
            })
        })
    }

    onClick(button: IBase) {
        button.buttonClicked();

        if(button.isExitButton()) {
            this.valueEntered.emit(this.service.getValue * (this.service.isDebitValue ? -1.0 : 1.0));
        }
    }
}
